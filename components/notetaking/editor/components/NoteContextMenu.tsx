import React, { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, FolderInput } from "lucide-react";
import { Note, Folder } from "@/types/notetaking";

interface NoteContextMenuProps {
  noteId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, folderId: string | null) => void;
  folders: Folder[];
  notes: Note[];
}

export function NoteContextMenu({
  noteId,
  position,
  onClose,
  onRename,
  onDelete,
  onMove,
  folders,
  notes,
}: NoteContextMenuProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const currentNote = notes.find((note) => note._id === noteId);
  const [newTitle, setNewTitle] = useState(currentNote?.title || "");

  useEffect(() => {
    if (currentNote) {
      setNewTitle(currentNote.title);
    }
  }, [currentNote]);

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    try {
      await onRename(noteId, newTitle.trim());
      setIsRenameDialogOpen(false);
    } catch (error) {
      console.error("Failed to rename note:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(noteId);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleMove = async (targetFolderId: string | null) => {
    try {
      await onMove(noteId, targetFolderId);
    } catch (error) {
      console.error("Failed to move note:", error);
    }
  };

  useEffect(() => {
    return () => {
      setIsRenameDialogOpen(false);
      setIsDeleteDialogOpen(false);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          zIndex: 50,
        }}
      >
        <DropdownMenu defaultOpen onOpenChange={(open) => !open && onClose()}>
          <DropdownMenuTrigger asChild>
            <div />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-[#3e3e3e] bg-[#2e2e2e] text-white">
            <DropdownMenuItem
              onClick={() => setIsRenameDialogOpen(true)}
              className="cursor-pointer hover:bg-[#3e3e3e]"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer hover:bg-[#3e3e3e]">
                <FolderInput className="mr-2 h-4 w-4" />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="border-[#3e3e3e] bg-[#2e2e2e] text-white">
                <DropdownMenuItem
                  onClick={() => {
                    onMove(noteId, null);
                    onClose();
                  }}
                  className="cursor-pointer hover:bg-[#3e3e3e]"
                >
                  Uncategorized
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#3e3e3e]" />
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder._id}
                    onClick={() => {
                      onMove(noteId, folder._id);
                      onClose();
                    }}
                    className="cursor-pointer hover:bg-[#3e3e3e]"
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator className="bg-[#3e3e3e]" />
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="cursor-pointer text-red-400 hover:bg-[#3e3e3e] hover:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rename Dialog */}
      <Dialog
        open={isRenameDialogOpen}
        onOpenChange={(open) => {
          setIsRenameDialogOpen(open);
          if (!open) setNewTitle(currentNote?.title || "");
        }}
      >
        <DialogContent className="border-[#3e3e3e] bg-[#2e2e2e] text-white">
          <DialogHeader>
            <DialogTitle>Rename Note</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a new name for your note.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border-[#3e3e3e] bg-[#1e1e1e] text-white"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              className="border-[#3e3e3e] bg-transparent text-white hover:bg-[#3e3e3e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-[#3e3e3e] bg-[#2e2e2e] text-white">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-[#3e3e3e] bg-transparent text-white hover:bg-[#3e3e3e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
