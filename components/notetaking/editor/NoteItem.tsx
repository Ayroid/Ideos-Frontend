import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical } from 'lucide-react'
import { Note, Folder } from '@/types/notetaking/index'

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
  onMove 
}) => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(note.title)

  return (
    <li 
      className={`flex items-center justify-between p-2 rounded-md transition-colors duration-200 ${
        currentNote && currentNote._id === note._id ? 'bg-secondary' : 'hover:bg-secondary'
      }`}
    >
      {isRenaming ? (
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={() => {
            onRename(note._id, newTitle)
            setIsRenaming(false)
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onRename(note._id, newTitle)
              setIsRenaming(false)
            }
          }}
          className="h-6 text-sm"
          autoFocus
        />
      ) : (
        <>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onSelect(note)}>
            <FileText className="h-4 w-4" />
            <span className="text-sm truncate">{note.title}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setIsRenaming(true)}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onDelete(note._id)}>
                  Delete
                </DropdownMenuItem>
                {folders.map(folder => (
                  <DropdownMenuItem key={folder._id} onSelect={() => onMove(note._id, folder._id)}>
                    Move to {folder.name}
                  </DropdownMenuItem>
                ))}
                {note.folderId && (
                  <DropdownMenuItem onSelect={() => onMove(note._id, null)}>
                    Move to Uncategorized
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </li>
  )
}