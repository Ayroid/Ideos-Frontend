import React, { useState } from 'react';
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
  MoreVertical
} from "lucide-react";
import { Note, Folder as FolderType } from '@/types/notetaking';
import { NoteContextMenu } from './NoteContextMenu';
import { FolderContextMenu } from './FolderContextMenu';

interface SidebarProps {
  notes: Note[];
  folders: FolderType[];
  currentNote: Note | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateNote: () => void;
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
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<{ type: 'note' | 'folder'; id: string } | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    type: 'note' | 'folder',
    id: string
  ) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setActiveContextMenu({ type, id });
  };

  // Close context menu when clicking outside
  const handleClickOutside = () => {
    setContextMenuPosition(null);
    setActiveContextMenu(null);
  };

  if (isCollapsed) {
    return (
      <aside className="w-14 border-r border-[#2e2e2e] flex flex-col items-center py-4 bg-[#1e1e1e]">
        {/* Collapsed view content */}
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="text-[#888] hover:text-white hover:bg-[#2e2e2e]">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="mt-4 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onCreateNote} className="text-[#888] hover:text-white hover:bg-[#2e2e2e]">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Note</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onOpenCommandMenu} className="text-[#888] hover:text-white hover:bg-[#2e2e2e]">
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
    <aside className="w-64 border-r border-[#2e2e2e] flex flex-col bg-[#1e1e1e]">
      <div className="h-14 border-b border-[#2e2e2e] flex items-center justify-between px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCollapse}
          className="text-[#888] hover:text-white hover:bg-[#2e2e2e]"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#888] hover:text-white hover:bg-[#2e2e2e]"
            onClick={onOpenCommandMenu}
          >
            <Command className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#888] hover:text-white hover:bg-[#2e2e2e]"
            onClick={onCreateNote}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#666]" />
          <Input
            placeholder="Filter..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-transparent border-[#2e2e2e] text-white placeholder:text-[#666] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#3e3e3e]"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {folders.map((folder) => (
            <div key={folder._id} className="space-y-1">
              <button
                onClick={() => toggleFolder(folder._id)}
                onContextMenu={(e) => handleContextMenu(e, 'folder', folder._id)}
                className="w-full flex items-center px-2 py-1.5 text-sm text-[#888] hover:text-white hover:bg-[#2e2e2e] rounded-md group"
              >
                {expandedFolders[folder._id] ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#888] hover:text-white hover:bg-[#3e3e3e]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateNote();
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#888] hover:text-white hover:bg-[#3e3e3e]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContextMenu(e, 'folder', folder._id);
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
                      note.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((note) => (
                      <button
                        key={note._id}
                        onClick={() => onSelectNote(note)}
                        onContextMenu={(e) => handleContextMenu(e, 'note', note._id)}
                        className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md group ${
                          currentNote?._id === note._id
                            ? "bg-[#3e3e3e] text-white"
                            : "text-[#888] hover:text-white hover:bg-[#2e2e2e]"
                        }`}
                      >
                        <span className="flex-1 text-left truncate">{note.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#888] hover:text-white hover:bg-[#3e3e3e]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContextMenu(e, 'note', note._id);
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
              onClick={() => toggleFolder('uncategorized')}
              className="w-full flex items-center px-2 py-1.5 text-sm text-[#888] hover:text-white hover:bg-[#2e2e2e] rounded-md group"
            >
              {expandedFolders['uncategorized'] ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              <span className="flex-1 text-left">Uncategorized</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#888] hover:text-white hover:bg-[#3e3e3e]"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNote();
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </button>
            {expandedFolders['uncategorized'] && (
              <div className="ml-4 space-y-1">
                {notes
                  .filter((note) => note.folderId === null)
                  .filter((note) =>
                    note.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((note) => (
                    <button
                      key={note._id}
                      onClick={() => onSelectNote(note)}
                      onContextMenu={(e) => handleContextMenu(e, 'note', note._id)}
                      className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md group ${
                        currentNote?._id === note._id
                          ? "bg-[#3e3e3e] text-white"
                          : "text-[#888] hover:text-white hover:bg-[#2e2e2e]"
                      }`}
                    >
                      <span className="flex-1 text-left truncate">{note.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-[#888] hover:text-white hover:bg-[#3e3e3e]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContextMenu(e, 'note', note._id);
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

      <div className="p-4 border-t border-[#2e2e2e]">
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateFolder}
          className="w-full bg-transparent border-[#2e2e2e] text-[#888] hover:text-white hover:bg-[#2e2e2e]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Context Menus */}
      {contextMenuPosition && activeContextMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={handleClickOutside}
          />
          {activeContextMenu.type === 'note' ? (
            <NoteContextMenu
              noteId={activeContextMenu.id}
              position={contextMenuPosition}
              onClose={handleClickOutside}
              onRename={onRenameNote}
              onDelete={onDeleteNote}
              onMove={onMoveNote}
              folders={folders}
              notes={notes}
            />
          ) : (
            <FolderContextMenu
              folderId={activeContextMenu.id}
              position={contextMenuPosition}
              onClose={handleClickOutside}
              onRename={onRenameFolder}
              onDelete={onDeleteFolder}
              folders={folders}
            />
          )}
        </>
      )}
    </aside>
  );
}

