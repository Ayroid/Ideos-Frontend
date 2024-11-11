"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Note, Folder as FolderType } from "@/types/notetaking";
import { FolderItem } from "./FolderItemNew";
import { NoteItem } from "./NoteItemNew";

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
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({
    uncategorized: true
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

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

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {/* Folders */}
          {folders.map((folder) => (
            <FolderItem
              key={folder._id}
              folder={folder}
              notes={filteredNotes}
              currentNote={currentNote}
              folders={folders}
              onSelectNote={onSelectNote}
              onRenameNote={onRenameNote}
              onDeleteNote={onDeleteNote}
              onMoveNote={onMoveNote}
              onRename={onRenameFolder}
              onDelete={onDeleteFolder}
              onCreateNote={onCreateNote}
              isExpanded={!!expandedFolders[folder._id]}
              onToggleExpand={() => toggleFolder(folder._id)}
            />
          ))}

          {/* Uncategorized Notes Section */}
          <div className="space-y-1">
            {filteredNotes
              .filter((note) => note.folderId === null)
              .map((note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  currentNote={currentNote}
                  folders={folders}
                  onSelect={onSelectNote}
                  onRename={onRenameNote}
                  onDelete={onDeleteNote}
                  onMove={onMoveNote}
                />
              ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
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
    </aside>
  );
}