"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Menu,
  Plus,
  Command,
  ChevronDown,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Note, Folder as FolderType } from "@/types/notetaking";
import { NoteContextMenu } from "./NoteContextMenu";
import { FolderContextMenu } from "./FolderContextMenu";

interface SidebarProps {
  notes: Note[];
  folders: FolderType[];
  currentNote: Note | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateNote: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onSelectNote: (note: Note) => void;
  onRenameNote: (id: string, title: string) => void;
  onDeleteNote: (id: string) => void;
  onMoveNote: (id: string, folderId: string | null) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCommandMenu: () => void;
  expandedFolders: { [key: string]: boolean };
  setExpandedFolders: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

export default function Sidebar({
  notes,
  folders,
  currentNote,
  searchTerm,
  onSearchChange,
  onCreateNote,
  onCreateFolder,
  onSelectNote,
  onRenameNote,
  onDeleteNote,
  onMoveNote,
  onRenameFolder,
  onDeleteFolder,
  isCollapsed,
  onToggleCollapse,
  onOpenCommandMenu,
  expandedFolders,
  setExpandedFolders,
}: SidebarProps) {
  const [contextMenu, setContextMenu] = useState<{
    type: "note" | "folder";
    id: string;
    position: { x: number; y: number };
  } | null>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        !target.closest('[role="dialog"]') &&
        !target.closest('[role="menu"]')
      ) {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, type: "note" | "folder", id: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        type,
        id,
        position: { x: e.clientX, y: e.clientY },
      });
    },
    [],
  );

  const toggleFolder = useCallback(
    (folderId: string) => {
      setExpandedFolders((prev) => ({
        ...prev,
        [folderId]: !prev[folderId],
      }));
    },
    [setExpandedFolders],
  );

  if (isCollapsed) {
    return (
      <aside className="flex w-14 flex-col items-center border-r border-[#2e2e2e] bg-[#1e1e1e] py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-[#888] hover:bg-[#2e2e2e] hover:text-white"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="mt-4 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCreateNote(null)}
                  className="text-[#888] hover:bg-[#2e2e2e] hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Note</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenCommandMenu}
                  className="text-[#888] hover:bg-[#2e2e2e] hover:text-white"
                >
                  <Command className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Command Menu (⌘K)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-64 flex-col border-r border-[#2e2e2e] bg-[#1e1e1e]">
      {/* Header with collapse button and actions */}
      <div className="flex h-14 items-center justify-between border-b border-[#2e2e2e] px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-[#888] hover:bg-[#2e2e2e] hover:text-white"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#888] hover:bg-[#2e2e2e] hover:text-white"
            onClick={onOpenCommandMenu}
          >
            <Command className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#888] hover:bg-[#2e2e2e] hover:text-white"
            onClick={() => onCreateNote(null)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search section */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#666]" />
          <Input
            placeholder="Filter..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-[#2e2e2e] bg-transparent pl-8 text-white placeholder:text-[#666] focus-visible:border-[#3e3e3e] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Main content area with ScrollArea */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {/* Folders and notes will be rendered here in the next section */}
          {folders.map((folder) => (
            <div key={folder._id} className="space-y-1">
              <button
                onClick={() => toggleFolder(folder._id)}
                onContextMenu={(e) =>
                  handleContextMenu(e, "folder", folder._id)
                }
                className="group flex w-full items-center rounded-md px-2 py-1.5 text-sm text-[#888] hover:bg-[#2e2e2e] hover:text-white"
              >
                {expandedFolders[folder._id] ? (
                  <ChevronDown className="mr-1 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-1 h-4 w-4" />
                )}
                <span className="flex-1 truncate text-left">{folder.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-[#888] opacity-0 hover:bg-[#3e3e3e] hover:text-white group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateNote(folder._id);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-[#888] opacity-0 hover:bg-[#3e3e3e] hover:text-white group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContextMenu(e, "folder", folder._id);
                  }}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </button>
              {expandedFolders[folder._id] && (
                <div className="ml-4 space-y-1">
                  {notes
                    .filter((note) => note.folderId === folder._id)
                    .filter((note) =>
                      note.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                    )
                    .map((note) => (
                      <button
                        key={note._id}
                        onClick={() => onSelectNote(note)}
                        onContextMenu={(e) =>
                          handleContextMenu(e, "note", note._id)
                        }
                        className={`group flex w-full items-center rounded-md px-2 py-1.5 text-sm ${
                          currentNote?._id === note._id
                            ? "bg-[#3e3e3e] text-white"
                            : "text-[#888] hover:bg-[#2e2e2e] hover:text-white"
                        }`}
                      >
                        <span className="flex-1 truncate text-left">
                          {note.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-[#888] opacity-0 hover:bg-[#3e3e3e] hover:text-white group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContextMenu(e, "note", note._id);
                          }}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}

          {/* Uncategorized Notes Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleFolder("uncategorized")}
              className="group flex w-full items-center rounded-md px-2 py-1.5 text-sm text-[#888] hover:bg-[#2e2e2e] hover:text-white"
            >
              {expandedFolders["uncategorized"] ? (
                <ChevronDown className="mr-1 h-4 w-4" />
              ) : (
                <ChevronRight className="mr-1 h-4 w-4" />
              )}
              <span className="flex-1 text-left">Uncategorized</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[#888] opacity-0 hover:bg-[#3e3e3e] hover:text-white group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNote(null);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </button>
            {expandedFolders["uncategorized"] && (
              <div className="ml-4 space-y-1">
                {notes
                  .filter((note) => note.folderId === null)
                  .filter((note) =>
                    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((note) => (
                    <button
                      key={note._id}
                      onClick={() => onSelectNote(note)}
                      onContextMenu={(e) =>
                        handleContextMenu(e, "note", note._id)
                      }
                      className={`group flex w-full items-center rounded-md px-2 py-1.5 text-sm ${
                        currentNote?._id === note._id
                          ? "bg-[#3e3e3e] text-white"
                          : "text-[#888] hover:bg-[#2e2e2e] hover:text-white"
                      }`}
                    >
                      <span className="flex-1 truncate text-left">
                        {note.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#888] opacity-0 hover:bg-[#3e3e3e] hover:text-white group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, "note", note._id);
                        }}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-[#2e2e2e] p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateFolder}
          className="w-full border-[#2e2e2e] bg-transparent text-[#888] hover:bg-[#2e2e2e] hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Context Menus */}
      {contextMenu &&
        (contextMenu.type === "note" ? (
          <NoteContextMenu
            noteId={contextMenu.id}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
            onRename={onRenameNote}
            onDelete={onDeleteNote}
            onMove={onMoveNote}
            folders={folders}
            notes={notes}
          />
        ) : (
          <FolderContextMenu
            folderId={contextMenu.id}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
            onRename={onRenameFolder}
            onDelete={onDeleteFolder}
            folders={folders}
          />
        ))}
    </aside>
  );
}
