// FolderItem.tsx
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
import { ChevronDown, ChevronRight, Plus, MoreVertical } from 'lucide-react'
import { NoteItem } from './NoteItemNew'
import { Folder as FolderType, Note } from '@/types/notetaking'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FolderItemProps {
  folder: FolderType
  notes: Note[]
  currentNote: Note | null
  folders: FolderType[]
  onSelectNote: (note: Note) => void
  onRenameNote: (id: string, newTitle: string) => void
  onDeleteNote: (id: string) => void
  onMoveNote: (id: string, folderId: string | null) => void
  onRename: (id: string, newName: string) => void
  onDelete: (id: string) => void
  onCreateNote: (folderId: string) => void
  isExpanded: boolean
  onToggleExpand: () => void
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  notes,
  currentNote,
  folders,
  onSelectNote,
  onRenameNote,
  onDeleteNote,
  onMoveNote,
  onRename,
  onDelete,
  onCreateNote,
  isExpanded,
  onToggleExpand,
}) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newName, setNewName] = useState(folder.name)

  const handleRename = () => {
    if (!newName.trim()) return
    onRename(folder._id, newName.trim())
    setIsRenameDialogOpen(false)
  }

  return (
    <div className="space-y-1">
      <button
        onClick={onToggleExpand}
        className="group flex w-full items-center rounded-md px-2 py-1.5 text-sm text-[#888] hover:bg-[#2e2e2e] hover:text-white"
      >
        {isExpanded ? (
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
            e.stopPropagation()
            onCreateNote(folder._id)
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
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

      {isExpanded && (
        <div className="ml-4 space-y-1">
          {notes
            .filter((note) => note.folderId === folder._id)
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
      )}

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="border-[#3e3e3e] bg-[#2e2e2e] text-white">
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter a new name for your folder.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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
              disabled={!newName.trim()}
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
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this folder? All notes inside will be moved to Uncategorized.
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
                onDelete(folder._id)
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