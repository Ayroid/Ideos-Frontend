import React from 'react';
import { Command } from 'cmdk';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { File, Folder, Search } from "lucide-react";
import { Note, Folder as FolderType } from '@/types/notetaking';

interface CommandMenuProps {
  notes: Note[];
  folders: FolderType[];
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandMenu({
  notes,
  folders,
  onSelectNote,
  onCreateNote,
  onCreateFolder,
  isOpen,
  onClose,
}: CommandMenuProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onClose]);

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder="Search all notes and folders..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Notes">
          {notes
            .filter((note) =>
              note.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((note) => (
              <CommandItem
                key={note._id}
                value={note.title}
                onSelect={() => {
                  onSelectNote(note);
                  onClose();
                }}
              >
                <File className="mr-2 h-4 w-4" />
                {note.title}
              </CommandItem>
            ))}
          <CommandItem onSelect={onCreateNote}>
            <File className="mr-2 h-4 w-4" />
            Create new note
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Folders">
          {folders
            .filter((folder) =>
              folder.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((folder) => (
              <CommandItem key={folder._id} value={folder.name}>
                <Folder className="mr-2 h-4 w-4" />
                {folder.name}
              </CommandItem>
            ))}
          <CommandItem onSelect={onCreateFolder}>
            <Folder className="mr-2 h-4 w-4" />
            Create new folder
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}