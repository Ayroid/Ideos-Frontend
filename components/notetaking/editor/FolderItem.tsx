import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Folder, FileText, Trash } from 'lucide-react'
import { NoteItem } from './NoteItem'
import { Folder as FolderType, Note } from '@/types/notetaking/index'

interface FolderItemProps {
  folder: FolderType
  notes: Note[]
  currentNote: Note | null // New prop for currentNote
  folders: FolderType[] // New prop for folders
  onSelectNote: (note: Note) => void // New prop for note selection
  onRenameNote: (id: string, newTitle: string) => void // New prop for note renaming
  onDeleteNote: (id: string) => void // New prop for note deletion
  onMoveNote: (id: string, folderId: string | null) => void // New prop for note moving
  onRename: (id: string, newName: string) => void
  onDelete: (id: string) => void
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
}) => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(folder.name)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {isRenaming ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => {
              onRename(folder._id, newName)
              setIsRenaming(false)
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onRename(folder._id, newName)
                setIsRenaming(false)
              }
            }}
            className="h-6 text-sm"
            autoFocus
          />
        ) : (
          <div className="flex items-center">
            <Folder className="mr-2 h-4 w-4" />
            <span className="font-medium">{folder.name}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsRenaming(true)}
                >
                  <FileText className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rename Folder</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onDelete(folder._id)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Folder</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ul className="space-y-1 ml-6">
        {notes
          .filter(note => note.folderId === folder._id)
          .map(note => (
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
      </ul>
    </div>
  )
}
