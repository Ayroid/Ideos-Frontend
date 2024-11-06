"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Folder,
  FileText,
  FolderPlus,
  Save,
  ImageIcon,
  Code,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Search,
  Loader2,
  ChevronDown,
  MoreVertical,
  Layout,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { NoteItem } from "./NoteItem";
import { FolderItem } from "./FolderItem";
import { convertHtmlToMarkup, convertMarkupToHtml } from "@/utils/conversions";
import axios from "axios";
import {
  Note,
  Folder as FolderType,
  Workspace,
} from "@/types/notetaking/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Editor, { loader } from "@monaco-editor/react";
import { useTheme } from "next-themes";

// Load Monaco Editor's themes
loader.init().then((monaco) => {
  monaco.editor.defineTheme("myCustomTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#1f2937",
    },
  });
});

interface NoteTakingAppProps {
  workspaceId: string;
}

export default function NoteTakingApp({ workspaceId }: NoteTakingAppProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [renderedContent, setRenderedContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [debouncedContent] = useDebounce(currentNote?.content, 1000);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null,
  );
  const { theme } = useTheme();

  useEffect(() => {
    // Load notes and folders from localStorage or API
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const savedFolders = JSON.parse(localStorage.getItem("folders") || "[]");
    setNotes(savedNotes);
    setFolders(savedFolders);
  }, []);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const savedFolders = JSON.parse(localStorage.getItem("folders") || "[]");
    setNotes(savedNotes);
    setFolders(savedFolders);
    if (savedNotes.length > 0) {
      setCurrentNote(savedNotes[0]);
    } else {
      createNewNote();
    }
  }, []);

  useEffect(() => {
    if (currentNote && isPreview) {
      renderContent(currentNote.content, currentNote.isMarkup);
    }
  }, [currentNote, isPreview]);

  useEffect(() => {
    if (debouncedContent) {
      saveNote();
    }
  }, [debouncedContent]);

  const renderContent = useCallback((content: string, isMarkup: boolean) => {
    if (isMarkup) {
      setRenderedContent(convertMarkupToHtml(content));
    } else {
      setRenderedContent(content);
    }
  }, []);

  const saveNote = () => {
    if (currentNote) {
      setIsSaving(true);
      const updatedNotes = notes.map((note) =>
        note._id === currentNote._id ? currentNote : note,
      );
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setTimeout(() => setIsSaving(false), 500); // Simulate a short delay for saving
    }
  };

  const createNewNote = useCallback(async () => {
    try {
      const newNote = {
        title: "Untitled Note",
        content: " ",
        folderId: null,
        isMarkup: false,
      };

      const response = await axios.post("/api/notetaking/notes", newNote);

      const createdNote = response.data;

      // Update local state with the new note
      setNotes((prevNotes) => [...prevNotes, createdNote]);
      setCurrentNote(createdNote);

      // Optional: Update localStorage if you need offline support
      localStorage.setItem("notes", JSON.stringify([...notes, createdNote]));
    } catch (error) {
      console.error("Failed to create a new note:", error);
      // Handle error, e.g., show a notification
    }
  }, [notes]);

  const createNewFolder = async () => {
    try {
      const newFolderData = {
        name: "New Folder",
        workspaceId: workspaceId,
      };

      // Send POST request to backend API to create the folder
      const response = await axios.post(
        "/api/notetaking/folders",
        newFolderData,
      );
      const createdFolder = response.data;

      // Update state with the created folder from backend
      setFolders((prevFolders) => [...prevFolders, createdFolder]);

      // Optional: update localStorage if necessary
      localStorage.setItem(
        "folders",
        JSON.stringify([...folders, createdFolder]),
      );
    } catch (error) {
      console.error("Failed to create a new folder:", error);
      // Handle the error, e.g., by showing a notification to the user
    }
  };

  const selectNote = (note: Note) => {
    saveNote();
    setCurrentNote(note);
    setIsPreview(false);
  };

  const deleteNote = async (noteId: string) => {
    try {
      console.log("Deleting note with ID:", noteId);
      await axios.delete(`/api/notetaking/notes/${noteId}`);

      // Update local state after successful deletion from backend
      const updatedNotes = notes.filter((note) => note._id !== noteId);
      setNotes(updatedNotes);

      // Optional: update localStorage if necessary
      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      // If the current note is deleted, select the first remaining note or null
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote(updatedNotes[0] || null);
      }
    } catch (error) {
      console.error("Failed to delete the note:", error);
      // Handle the error, e.g., by showing a notification to the user
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      console.log(
        "Deleting folder with ID:",
        folderId,
        "from workspace:",
        workspaceId,
      );

      // Send DELETE request to the API route with workspaceId as a query parameter
      await axios.delete(
        `/api/notetaking/folders/${folderId}?workspaceId=${workspaceId}`,
      );

      // Update folders in local state after successful deletion
      const updatedFolders = folders.filter(
        (folder) => folder._id !== folderId,
      );
      setFolders(updatedFolders);
      localStorage.setItem("folders", JSON.stringify(updatedFolders));

      // Update notes: remove folderId from notes that were in the deleted folder
      const updatedNotes = notes.map((note) =>
        note.folderId === folderId ? { ...note, folderId: null } : note,
      );
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      console.error("Failed to delete the folder:", error);
      // Handle error (e.g., show a notification)
    }
  };

  const renameNote = (noteId: string, newTitle: string) => {
    const updatedNotes = notes.map((note) =>
      note._id === noteId ? { ...note, title: newTitle } : note,
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    if (currentNote && currentNote._id === noteId) {
      setCurrentNote({ ...currentNote, title: newTitle });
    }
  };

  const renameFolder = (folderId: string, newName: string) => {
    const updatedFolders = folders.map((folder) =>
      folder._id === folderId ? { ...folder, name: newName } : folder,
    );
    setFolders(updatedFolders);
    localStorage.setItem("folders", JSON.stringify(updatedFolders));
  };

  const moveNote = (noteId: string, targetFolderId: string | null) => {
    const updatedNotes = notes.map((note) =>
      note._id === noteId ? { ...note, folderId: targetFolderId } : note,
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    if (currentNote && currentNote._id === noteId) {
      setCurrentNote({ ...currentNote, folderId: targetFolderId });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentNote) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const imageElement = currentNote.isMarkup
            ? `![${file.name}](${reader.result} ==${img.width}x${img.height})`
            : `<img src="${reader.result}" alt="${file.name}" width="${img.width}" height="${img.height}">`;
          const updatedContent = currentNote.content + "\n" + imageElement;
          setCurrentNote({ ...currentNote, content: updatedContent });
          if (isPreview) {
            renderContent(updatedContent, currentNote.isMarkup);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMarkup = () => {
    if (currentNote) {
      const newIsMarkup = !currentNote.isMarkup;
      let newContent = currentNote.content;

      if (newIsMarkup) {
        newContent = convertHtmlToMarkup(newContent);
      } else {
        newContent = convertMarkupToHtml(newContent);
      }

      setCurrentNote({
        ...currentNote,
        isMarkup: newIsMarkup,
        content: newContent,
      });
      setIsPreview(false);
    }
  };

  const handleContentChange = (value: string) => {
    if (currentNote) {
      setCurrentNote({ ...currentNote, content: value });
      if (isPreview) {
        renderContent(value, currentNote.isMarkup);
      }
    }
  };

  const applyFormatting = (format: string) => {
    if (currentNote?.isMarkup) {
      const textarea = document.getElementById(
        "note-content",
      ) as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      let formattedText = "";

      switch (format) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `_${selectedText}_`;
          break;
        case "underline":
          formattedText = `~~${selectedText}~~`;
          break;
        case "h1":
          formattedText = `# ${selectedText}`;
          break;
        case "h2":
          formattedText = `## ${selectedText}`;
          break;
        case "h3":
          formattedText = `### ${selectedText}`;
          break;
        case "list":
          formattedText = `\n- ${selectedText}`;
          break;
        case "ordered-list":
          formattedText = `\n1. ${selectedText}`;
          break;
        case "quote":
          formattedText = `> ${selectedText}`;
          break;
        case "link":
          const url = prompt("Enter the URL:");
          formattedText = `[[${url}|${selectedText}]]`;
          break;
        default:
          formattedText = selectedText;
      }

      const newContent =
        textarea.value.substring(0, start) +
        formattedText +
        textarea.value.substring(end);

      setCurrentNote({ ...currentNote, content: newContent });
      if (isPreview) {
        renderContent(newContent, true);
      }
    } else {
      document.execCommand(format);
    }
  };

  const createNewWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setCurrentWorkspace(newWorkspace);
  };

  const switchWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    // Here you would typically load the notes and folders for the selected workspace
    // For this example, we'll just clear the current note
    setCurrentNote(null);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && currentNote) {
      setCurrentNote({ ...currentNote, content: value });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-lg font-semibold">Notes</h1>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={createNewNote}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Note</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={createNewFolder}>
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Folder</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-4 p-4">
            {folders.map((folder) => (
              <FolderItem
                key={folder._id}
                folder={folder}
                notes={notes}
                currentNote={currentNote}
                folders={folders}
                onSelectNote={selectNote}
                onRenameNote={renameNote}
                onDeleteNote={deleteNote}
                onMoveNote={moveNote}
                onRename={renameFolder}
                onDelete={deleteFolder}
              />
            ))}
            <div className="space-y-2">
              <div className="flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                <span className="font-medium">Uncategorized</span>
              </div>
              <ul className="space-y-1">
                {notes
                  .filter((note) => note.folderId === null)
                  .filter((note) =>
                    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((note) => (
                    <NoteItem
                      key={note._id}
                      note={note}
                      currentNote={currentNote}
                      folders={folders}
                      onSelect={selectNote}
                      onRename={renameNote}
                      onDelete={deleteNote}
                      onMove={moveNote}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              {currentWorkspace ? currentWorkspace.title : "My Workspace"}
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layout className="mr-2 h-4 w-4" />
                  Workspaces
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Workspaces</DialogTitle>
                  <DialogDescription>
                    View all workspaces or create a new one.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="New workspace name"
                      id="new-workspace-name"
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "new-workspace-name",
                        ) as HTMLInputElement;
                        if (input.value) {
                          createNewWorkspace(input.value);
                          input.value = "";
                        }
                      }}
                    >
                      Create
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {workspaces.map((workspace) => (
                        <div
                          key={workspace.id}
                          className="flex items-center justify-between rounded-lg border p-2"
                        >
                          <span>{workspace.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => switchWorkspace(workspace)}
                          >
                            Switch
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {currentNote && (
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload Image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={currentNote.isMarkup}
                      onPressedChange={toggleMarkup}
                      aria-label="Toggle Markup"
                    >
                      <Code className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Markup</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={isPreview}
                      onPressedChange={setIsPreview}
                      aria-label="Toggle Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Preview</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button onClick={saveNote} variant="default" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </header>
        {currentNote ? (
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <Input
                value={currentNote.title}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, title: e.target.value })
                }
                className="border-none bg-transparent text-xl font-bold focus-visible:ring-0"
                placeholder="Untitled Note"
              />
              {isPreview ? (
                <ScrollArea className="flex-1">
                  <div className="prose dark:prose-invert max-w-none p-8">
                    <div
                      dangerouslySetInnerHTML={{ __html: renderedContent }}
                    />
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-1 flex-col">
                  <div className="flex space-x-1 border-b bg-muted/40 p-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Paragraph
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => applyFormatting("h1")}
                        >
                          Heading 1
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => applyFormatting("h2")}
                        >
                          Heading 2
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => applyFormatting("h3")}
                        >
                          Heading 3
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("bold")}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("italic")}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("underline")}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("insertUnorderedList")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("insertOrderedList")}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("formatBlock")}
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("createLink")}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <div className="flex-1" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Find and Replace</DropdownMenuItem>
                        <DropdownMenuItem>Word Count</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {currentNote.isMarkup ? (
                      <div className="h-full border-t border-border">
                        <Editor
                          height="100%"
                          defaultLanguage="markdown"
                          value={currentNote.content}
                          onChange={handleEditorChange}
                          theme={theme === "dark" ? "myCustomTheme" : "light"}
                          options={{
                            minimap: { enabled: false },
                            wordWrap: "on",
                            wrappingIndent: "indent",
                            lineNumbers: "off",
                            folding: false,
                            lineDecorationsWidth: 0,
                            lineNumbersMinChars: 0,
                            glyphMargin: false,
                            padding: { top: 16, bottom: 16 },
                            scrollBeyondLastLine: false,
                            overviewRulerLanes: 0,
                            overviewRulerBorder: false,
                          }}
                          className="markdown-editor"
                        />
                      </div>
                    ) : (
                      <div
                        ref={editorRef}
                        id="note-content"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onInput={(e) => {
                          const target = e.target as HTMLDivElement;
                          const currentContent = target.innerHTML;
                          if (currentContent !== currentNote.content) {
                            handleContentChange(currentContent);
                          }
                        }}
                        className="min-h-full w-full resize-none overflow-auto p-4 focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-2 text-xl font-semibold">No Note Selected</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a note or create a new one to get started
              </p>
              <Button className="mt-4" onClick={createNewNote}>
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
