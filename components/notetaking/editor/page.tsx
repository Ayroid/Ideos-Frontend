"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Editor } from "novel";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Download, Network } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import {
  Note,
  Folder as FolderType,
  Workspace,
} from "@/types/notetaking/index";

// Import custom components
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/BreadCrumb";
import CommandMenu from "./components/CommandMenu";
import GraphView from "./components/GraphView";
import { toast } from "sonner";
import _ from "lodash";

export default function NoteTakingApp() {
  // States
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null,
  );
  const [content, setContent] = useState<string>();
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [pendingNoteChange, setPendingNoteChange] = useState<Note | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<string>("");
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [showGraphView, setShowGraphView] = useState(false);

  //  ✅
  const fetchNotesAndFolders = useCallback(async () => {
    try {
      const [notesResponse, foldersResponse] = await Promise.all([
        axios.get(`/api/notetaking/notes`),
        axios.get(`/api/notetaking/folders`),
      ]);

      if (notesResponse.status === 200) {
        const notesData = notesResponse.data || [];
        setNotes(notesData);
        if (notesData.length > 0 && !currentNote) {
          setCurrentNote(notesData[0]);
        }
      }

      if (foldersResponse.status === 200) {
        const foldersData = foldersResponse.data || [];
        setFolders(foldersData);
      }
    } catch (error) {
      console.error("Failed to fetch notes and folders:", error);
    }
  }, [currentNote]);

  useEffect(() => {
    fetchNotesAndFolders();
  }, [fetchNotesAndFolders]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandMenuOpen(true);
      }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        saveNote();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  //  ✅
  const saveNote = async () => {
    if (currentNote && !isSaving) {
      try {
        setIsSaving(true);
        const response = await axios.put(
          `/api/notetaking/notes/${currentNote._id}`,
          {
            ...currentNote,
            content: JSON.stringify(currentNote.content),
          },
        );

        const updatedNotes = notes.map((note) =>
          note._id === currentNote._id
            ? {
                ...currentNote,
                ...response.data,
                content: JSON.parse(response.data.content),
              }
            : note,
        );

        setNotes(updatedNotes);
        if (currentNote._id === response.data._id) {
          setCurrentNote({
            ...response.data,
            content: JSON.parse(response.data.content),
          });
        }

        toast.success("Note saved successfully");
        setTimeout(() => setIsSaving(false), 1000);
      } catch (error) {
        console.error("Failed to save the note:", error);
        toast.error("Failed to save the note");
        setIsSaving(false);
      }
    }
  };

  const parseContent = (content: any) => {
    if (!content) {
      return {
        type: "doc",
        content: [{ type: "paragraph", content: [] }],
      };
    }

    if (typeof content === "string") {
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse content:", e);
        return {
          type: "doc",
          content: [
            { type: "paragraph", content: [{ type: "text", text: content }] },
          ],
        };
      }
    }

    return content;
  };

  //  ✅
  const createNewNote = useCallback(async (folderId: string | null = null) => {
    try {
      const initialContent = {
        type: "doc",
        content: [{ type: "paragraph", content: [] }],
      };

      const newNoteData = {
        title: "Untitled Note",
        content: JSON.stringify(initialContent),
        folderId: folderId,
      };

      const response = await axios.post(`/api/notetaking/notes`, newNoteData);

      const parsedContent =
        typeof response.data.content === "string"
          ? JSON.parse(response.data.content)
          : response.data.content;

      const createdNote = {
        ...response.data,
        content: parsedContent,
      };

      setNotes((prevNotes) => [...prevNotes, createdNote]);
      setCurrentNote(createdNote);

      toast.success("New note created");
    } catch (error) {
      console.error("Failed to create a new note:", error);
      toast.error("Failed to create new note");
    }
  }, []);

  const selectNote = (note: Note) => {
    if (currentNote && currentNote._id !== note._id) {
      setShowSaveWarning(true);
      setPendingNoteChange(note);
    } else {
      setCurrentNote(note);
    }
  };

  const handleContentChange = useCallback(
    (editor?: TipTapEditor) => {
      if (editor && currentNote) {
        const jsonContent = editor.getJSON();
        const htmlContent = editor.getHTML();

        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer);
        }

        const timer = setTimeout(async () => {
          if (htmlContent !== lastSavedContent) {
            try {
              const response = await axios.put(
                `/api/notetaking/notes/${currentNote._id}`,
                {
                  ...currentNote,
                  content: JSON.stringify(jsonContent),
                },
              );
              setLastSavedContent(htmlContent);

              const parsedContent = parseContent(response.data.content);
              setCurrentNote((prev) => ({
                ...prev!,
                ...response.data,
                content: parsedContent,
              }));
            } catch (error) {
              console.error("Failed to auto-save note:", error);
            }
          }
        }, 30000);

        setAutoSaveTimer(timer);
        setContent(htmlContent);
        setCurrentNote((prev) => ({
          ...prev!,
          content: jsonContent,
        }));
      }
    },
    [currentNote, lastSavedContent, autoSaveTimer],
  );

  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  const editorProps = {
    defaultValue: currentNote?.content
      ? parseContent(currentNote.content)
      : { type: "doc", content: [{ type: "paragraph", content: [] }] },
    onDebouncedUpdate: handleContentChange,
    disableLocalStorage: true,
    immediatelyRender: false,
    className: "min-h-[calc(100vh-12rem)] prose prose-sm dark:prose-invert",
  };

  const downloadAsPDF = async () => {
    if (!currentNote) return;

    const content = document.querySelector(".editor-content");
    if (!content) return;

    try {
      const canvas = await html2canvas(content as HTMLElement);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${currentNote.title || "Untitled"}.pdf`);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  //  ✅
  const createNewFolder = async () => {
    try {
      const newFolderData = {
        name: "New Folder",
      };
      const response = await axios.post(
        `/api/notetaking/folders`,
        newFolderData,
      );
      const createdFolder = response.data;
      setFolders((prevFolders) => [...prevFolders, createdFolder]);

      toast.success("New folder created");
    } catch (error) {
      console.error("Failed to create a new folder:", error);
      toast.error("Failed to create new folder");
    }
  };

  //  ✅
  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        const noteToDelete = notes.find((note) => note._id === noteId);
        if (!noteToDelete) return;

        // Optimistically update UI
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId),
        );

        if (currentNote && currentNote._id === noteId) {
          const remainingNotes = notes.filter((note) => note._id !== noteId);
          setCurrentNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
        }

        // Make API call
        await axios.delete(`/api/notetaking/notes/${noteId}`);
        toast.success("Note deleted successfully");
      } catch (error) {
        console.error("Failed to delete note:", error);
        fetchNotesAndFolders();
        toast.error("Failed to delete note");
      }
    },
    [notes, currentNote, fetchNotesAndFolders],
  );

  //  ✅
  const deleteFolder = useCallback(
    async (folderId: string) => {
      try {
        await axios.delete(`/api/notetaking/folders/${folderId}`);
        toast.success("Folder deleted successfully");
      } catch (error) {
        console.error("Failed to delete folder:", error);
        fetchNotesAndFolders();
        toast.error("Failed to delete folder");
      }
    },
    [folders, notes, fetchNotesAndFolders],
  );

  //  ✅
  const renameNote = async (noteId: string, newTitle: string) => {
    try {
      const response = await axios.put(`/api/notetaking/notes/${noteId}`, {
        title: newTitle,
      });
      const updatedNote = {
        ...response.data,
        content:
          typeof response.data.content === "string"
            ? JSON.parse(response.data.content)
            : response.data.content,
      };

      const updatedNotes = notes.map((note) =>
        note._id === noteId ? updatedNote : note,
      );

      setNotes(updatedNotes);
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote(updatedNote);
      }

      toast.success("Note renamed successfully");
    } catch (error) {
      console.error("Failed to rename the note:", error);
      toast.error("Failed to rename note");
    }
  };

  //  ✅
  const renameFolder = async (folderId: string, newName: string) => {
    try {
      const response = await axios.put(`/api/notetaking/folders/${folderId}`, {
        name: newName,
      });

      const updatedFolder = response.data;
      const updatedFolders = folders.map((folder) =>
        folder._id === folderId ? updatedFolder : folder,
      );

      setFolders(updatedFolders);
      toast.success("Folder renamed successfully");
    } catch (error) {
      console.error("Failed to rename the folder:", error);
      toast.error("Failed to rename folder");
    }
  };

  //  ✅
  const moveNote = async (noteId: string, targetFolderId: string | null) => {
    try {
      const response = await axios.put(`/api/notetaking/notes/${noteId}/move`, {
        folderId: targetFolderId,
      });

      const updatedNote = {
        ...response.data,
        content:
          typeof response.data.content === "string"
            ? JSON.parse(response.data.content)
            : response.data.content,
      };

      const updatedNotes = notes.map((note) =>
        note._id === noteId ? updatedNote : note,
      );

      setNotes(updatedNotes);
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote(updatedNote);
      }

      // Expand the target folder or uncategorized section

      toast.success(
        targetFolderId ? "Note moved to folder" : "Note moved to uncategorized",
      );
    } catch (error) {
      console.error("Failed to move the note:", error);
      toast.error("Failed to move note");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentNote) return;

    const newTitle = e.target.value;
    const updatedNote = { ...currentNote, title: newTitle };

    // Update local state immediately
    setCurrentNote(updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === currentNote._id ? updatedNote : note,
      ),
    );
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      <Sidebar
        notes={notes}
        folders={folders}
        currentNote={currentNote}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateNote={createNewNote}
        onCreateFolder={createNewFolder}
        onSelectNote={selectNote}
        onRenameNote={renameNote}
        onDeleteNote={deleteNote}
        onMoveNote={moveNote}
        onRenameFolder={renameFolder}
        onDeleteFolder={deleteFolder}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
      />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#2e2e2e] bg-[#1e1e1e] px-4">
          <div className="flex items-center space-x-4">
            <Breadcrumb
              currentNote={currentNote}
              folders={folders}
              workspace={currentWorkspace}
            />
          </div>
          {currentNote && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsPDF}
                className="border-[#2e2e2e] bg-transparent text-white hover:bg-[#2e2e2e]"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                onClick={saveNote}
                variant="default"
                size="sm"
                disabled={isSaving}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGraphView(!showGraphView)}
                className={`border-[#2e2e2e] bg-transparent text-white hover:bg-[#2e2e2e] ${
                  showGraphView ? "bg-[#2e2e2e]" : ""
                }`}
              >
                <Network className="mr-2 h-4 w-4" />
                Graph View
              </Button>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-auto">
          {showGraphView ? (
            <GraphView
              notes={notes}
              folders={folders}
              currentNote={currentNote}
              onSelectNote={selectNote}
            />
          ) : currentNote ? (
            <div className="h-full">
              <div className="px-4 py-6">
                <Input
                  value={currentNote.title}
                  onChange={handleTitleChange}
                  className="mb-6 border-none bg-transparent px-0 text-2xl font-bold text-white focus-visible:ring-0"
                  placeholder="Untitled Note"
                />
                <div className="editor-content bg-[#1e1e1e]">
                  <Editor
                    key={`editor-${currentNote?._id || "empty"}`}
                    {...editorProps}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-white">
              <h2 className="mb-2 text-2xl font-bold">No Note Selected</h2>
              <p className="mb-4 text-gray-400">
                Select a note from the sidebar or create a new one
              </p>
              <Button
                onClick={() => createNewNote()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create New Note
              </Button>
            </div>
          )}
        </main>
      </div>

      <CommandMenu
        notes={notes}
        folders={folders}
        onSelectNote={selectNote}
        onCreateNote={createNewNote}
        onCreateFolder={createNewFolder}
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
      />

      <AlertDialog open={showSaveWarning} onOpenChange={setShowSaveWarning}>
        <AlertDialogContent className="bg-[#2e2e2e] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You have unsaved changes. Do you want to save before switching
              notes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowSaveWarning(false);
                if (pendingNoteChange) {
                  setCurrentNote(pendingNoteChange);
                  setPendingNoteChange(null);
                }
              }}
              className="border-[#3e3e3e] bg-transparent text-white hover:bg-[#3e3e3e]"
            >
              Discard
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                saveNote();
                setShowSaveWarning(false);
                if (pendingNoteChange) {
                  setCurrentNote(pendingNoteChange);
                  setPendingNoteChange(null);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
