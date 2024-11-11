import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Pencil, Trash2 } from 'lucide-react';
import { Folder } from '@/types/notetaking';

interface FolderContextMenuProps {
  folderId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  folders: Folder[];
}

export function FolderContextMenu({
  folderId,
  position,
  onClose,
  onRename,
  onDelete,
  folders,
}: FolderContextMenuProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const currentFolder = folders.find(folder => folder._id === folderId);

  useEffect(() => {
    if (currentFolder) {
      setNewName(currentFolder.name);
    }
  }, [currentFolder]);

  const handleRename = () => {
    onRename(folderId, newName);
    setIsRenameDialogOpen(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete(folderId);
    setIsDeleteDialogOpen(false);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          zIndex: 50,
        }}
      >
        <DropdownMenu defaultOpen onOpenChange={(open) => !open && onClose()}>
          <DropdownMenuTrigger asChild>
            <div />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2e2e2e] text-white border-[#3e3e3e]">
            <DropdownMenuItem
              onClick={() => setIsRenameDialogOpen(true)}
              className="hover:bg-[#3e3e3e] cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3e3e3e]" />
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-400 hover:bg-[#3e3e3e] hover:text-red-400 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-[#2e2e2e] text-white border-[#3e3e3e]">
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a new name for your folder.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-[#1e1e1e] border-[#3e3e3e] text-white"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              className="bg-transparent border-[#3e3e3e] text-white hover:bg-[#3e3e3e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={!newName.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#2e2e2e] text-white border-[#3e3e3e]">
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this folder? All notes inside will be moved to Uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-transparent border-[#3e3e3e] text-white hover:bg-[#3e3e3e]"
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