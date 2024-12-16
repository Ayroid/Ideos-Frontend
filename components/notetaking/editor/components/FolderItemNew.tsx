import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Folder, FileText, Trash, Plus, ChevronRight, ChevronDown } from 'lucide-react'
import { NoteItem } from './NoteItemNew'
import { Folder as FolderType, Note } from '@/types/notetaking/index'

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
  onCreateNote: (folderId: string | null) => void // New prop
  isExpanded: boolean // New prop
  onToggleExpand: () => void // New prop
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
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(folder.name)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between group">
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-secondary"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
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
              className="h-6 text-sm ml-1"
              autoFocus
            />
          ) : (
            <div className="flex items-center ml-1">
              <Folder className="mr-2 h-4 w-4" />
              <span className="font-medium">{folder.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onCreateNote(folder._id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Note</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      {isExpanded && (
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
      )}
    </div>
  )
}