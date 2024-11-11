import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical } from 'lucide-react'
import { Note, Folder } from '@/types/notetaking'

interface NoteItemProps {
  note: Note
  currentNote: Note | null
  folders: Folder[]
  onSelect: (note: Note) => void
  onRename: (id: string, newTitle: string) => void
  onDelete: (id: string) => void
  onMove: (id: string, folderId: string | null) => void
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  currentNote,
  folders,
  onSelect,
  onRename,
  onDelete,
  onMove,
}) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(note.title)

  const handleRename = () => {
    if (!newTitle.trim()) return
    onRename(note._id, newTitle.trim())
    setIsRenameDialogOpen(false)
  }

  return (
    <div>
      <button
        onClick={() => onSelect(note)}
        className={`group flex w-full items-center rounded-md px-2 py-1.5 text-sm ${
          currentNote?._id === note._id
            ? "bg-[#3e3e3e] text-white"
            : "text-[#888] hover:bg-[#2e2e2e] hover:text-white"
        }`}
      >
        <FileText className="mr-2 h-4 w-4" />
        <span className="flex-1 truncate text-left">{note.title}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#888] opacity-0 hover:bg-[#3e3e3e] hover:text-white group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-[#3e3e3e] bg-[#2e2e2e] text-white">
            <DropdownMenuItem
              onClick={() => setIsRenameDialogOpen(true)}
              className="cursor-pointer hover:bg-[#3e3e3e]"
            >
              Rename
            </DropdownMenuItem>
            {folders.map((folder) => (
              <DropdownMenuItem
                key={folder._id}
                onClick={() => onMove(note._id, folder._id)}
                className="cursor-pointer hover:bg-[#3e3e3e]"
              >
                Move to {folder.name}
              </DropdownMenuItem>
            ))}
            {note.folderId && (
              <DropdownMenuItem
                onClick={() => onMove(note._id, null)}
                className="cursor-pointer hover:bg-[#3e3e3e]"
              >
                Move to Uncategorized
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#3e3e3e]" />
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="cursor-pointer text-red-400 hover:bg-[#3e3e3e] hover:text-red-400"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </button>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
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
            autoFocus
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
              Are you sure you want to delete this note? This action cannot be undone.
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
              onClick={() => {
                onDelete(note._id)
                setIsDeleteDialogOpen(false)
              }}
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}