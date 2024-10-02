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
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { NoteItem } from "./NoteItem";
import { FolderItem } from "./FolderItem";
import { convertHtmlToMarkup, convertMarkupToHtml } from "@/utils/conversions";
import { Note, Folder as FolderType } from "@/types/notetaking/index";

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [renderedContent, setRenderedContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [debouncedContent] = useDebounce(currentNote?.content, 1000);

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
        note.id === currentNote.id ? currentNote : note,
      );
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setTimeout(() => setIsSaving(false), 500); // Simulate a short delay for saving
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      folderId: null,
      isMarkup: false,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentNote(newNote);
    localStorage.setItem("notes", JSON.stringify([...notes, newNote]));
  };

  const createNewFolder = () => {
    const newFolder: FolderType = {
      id: Date.now().toString(),
      name: "New Folder",
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
    localStorage.setItem("folders", JSON.stringify([...folders, newFolder]));
  };

  const selectNote = (note: Note) => {
    saveNote();
    setCurrentNote(note);
    setIsPreview(false);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    if (currentNote && currentNote.id === noteId) {
      setCurrentNote(updatedNotes[0] || null);
    }
  };

  const deleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((folder) => folder.id !== folderId);
    setFolders(updatedFolders);
    localStorage.setItem("folders", JSON.stringify(updatedFolders));

    const updatedNotes = notes.map((note) =>
      note.folderId === folderId ? { ...note, folderId: null } : note,
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const renameNote = (noteId: string, newTitle: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, title: newTitle } : note,
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    if (currentNote && currentNote.id === noteId) {
      setCurrentNote({ ...currentNote, title: newTitle });
    }
  };

  const renameFolder = (folderId: string, newName: string) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId ? { ...folder, name: newName } : folder,
    );
    setFolders(updatedFolders);
    localStorage.setItem("folders", JSON.stringify(updatedFolders));
  };

  const moveNote = (noteId: string, targetFolderId: string | null) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, folderId: targetFolderId } : note,
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    if (currentNote && currentNote.id === noteId) {
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

  return (
    <div className="flex h-screen bg-muted text-foreground">
      <ScrollArea className="h-screen w-64 bg-secondary">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notes</h2>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={createNewFolder}
                    >
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Folder</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Separator />
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              notes={notes}
              currentNote={currentNote} // Pass currentNote
              folders={folders} // Pass the list of folders
              onSelectNote={selectNote} // Function to select a note
              onRenameNote={renameNote} // Function to rename a note
              onDeleteNote={deleteNote} // Function to delete a note
              onMoveNote={moveNote} // Function to move a note to a different folder
              onRename={renameFolder} // Already passed, renaming the folder
              onDelete={deleteFolder} // Already passed, deleting the folder
            />
          ))}

          <div className="space-y-2">
            <div className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              <span className="font-medium">Uncategorized</span>
            </div>
            <ul className="ml-6 space-y-1">
              {notes
                .filter((note) => note.folderId === null)
                .filter((note) =>
                  note.title.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((note) => (
                  <NoteItem
                    key={note.id}
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
      {currentNote ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between bg-secondary p-4">
            <Input
              value={currentNote.title}
              onChange={(e) =>
                setCurrentNote({ ...currentNote, title: e.target.value })
              }
              className="border-none bg-transparent text-xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Untitled Note"
            />
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={saveNote}
                      variant="default"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Note</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {isPreview ? (
              <div className="h-full overflow-auto p-4">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex space-x-2 bg-secondary p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("bold")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("italic")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("underline")}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("h1")}
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("h2")}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("h3")}
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("insertUnorderedList")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("insertOrderedList")}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("formatBlock")}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => applyFormatting("createLink")}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
                {currentNote.isMarkup ? (
                  <textarea
                    id="note-content"
                    value={currentNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full flex-1 resize-none bg-background p-4 font-mono focus:outline-none "
                    placeholder="Start writing your note here..."
                  />
                ) : (
                  <div
                    ref={editorRef}
                    id="note-content"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: currentNote.content }}
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement;
                      const selection = window.getSelection();
                      const range = selection?.getRangeAt(0);
                      handleContentChange(target.innerHTML);
                      if (selection && range) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                      }
                    }}
                    className="w-full flex-1 resize-none overflow-auto p-4 focus:outline-none"
                    style={{ minHeight: "1em" }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-muted-foreground">
            Select a note or create a new one to get started
          </p>
        </div>
      )}
    </div>
  );
}
