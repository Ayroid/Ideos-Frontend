"use client"

import React, { useState, useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Folder, File, Plus, Trash, Edit, Save, FileText, FolderPlus, MoreVertical } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  folderId: string | null
}

interface Folder {
  id: string
  name: string
}

const Sidebar: React.FC<{
  notes: Note[]
  folders: Folder[]
  currentNote: Note | null
  onSelectNote: (note: Note) => void
  onNewNote: () => void
  onNewFolder: () => void
  onDeleteNote: (noteId: string) => void
  onDeleteFolder: (folderId: string) => void
  onRenameNote: (noteId: string, newTitle: string) => void
  onMoveNote: (noteId: string, targetFolderId: string | null) => void
}> = ({ notes, folders, currentNote, onSelectNote, onNewNote, onNewFolder, onDeleteNote, onDeleteFolder, onRenameNote, onMoveNote }) => {
  const [renamingNoteId, setRenamingNoteId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")

  return (
    <ScrollArea className="w-64 bg-secondary h-screen">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notes</h2>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onNewNote}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Note</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onNewFolder}>
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Folder</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Separator />
        {folders.map(folder => (
          <div key={folder.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                <span className="font-medium">{folder.name}</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onDeleteFolder(folder.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Folder</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ul className="space-y-1 ml-6">
              {notes
                .filter(note => note.folderId === folder.id)
                .map(note => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    folders={folders}
                    currentNote={currentNote}
                    onSelectNote={onSelectNote}
                    onDeleteNote={onDeleteNote}
                    onRenameNote={onRenameNote}
                    onMoveNote={onMoveNote}
                  />
                ))}
            </ul>
          </div>
        ))}
        <div className="space-y-2">
          <div className="flex items-center">
            <Folder className="mr-2 h-4 w-4" />
            <span className="font-medium">Uncategorized</span>
          </div>
          <ul className="space-y-1 ml-6">
            {notes
              .filter(note => note.folderId === null)
              .map(note => (
                <NoteItem
                  key={note.id}
                  note={note}
                  folders={folders}
                  currentNote={currentNote}
                  onSelectNote={onSelectNote}
                  onDeleteNote={onDeleteNote}
                  onRenameNote={onRenameNote}
                  onMoveNote={onMoveNote}
                />
              ))}
          </ul>
        </div>
      </div>
    </ScrollArea>
  )
}

const NoteItem: React.FC<{
  note: Note
  folders: Folder[]
  currentNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
  onRenameNote: (noteId: string, newTitle: string) => void
  onMoveNote: (noteId: string, targetFolderId: string | null) => void
}> = ({ note, folders, currentNote, onSelectNote, onDeleteNote, onRenameNote, onMoveNote }) => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(note.title)

  return (
    <li 
      className={cn(
        "flex items-center justify-between p-2 rounded-md transition-colors duration-200",
        currentNote && currentNote.id === note.id ? 'bg-accent' : 'hover:bg-accent/50'
      )}
    >
      {isRenaming ? (
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={() => {
            onRenameNote(note.id, newTitle)
            setIsRenaming(false)
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onRenameNote(note.id, newTitle)
              setIsRenaming(false)
            }
          }}
          className="h-6 text-sm"
          autoFocus
        />
      ) : (
        <>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onSelectNote(note)}>
            <File className="h-4 w-4" />
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
                <DropdownMenuItem onSelect={() => onDeleteNote(note.id)}>
                  Delete
                </DropdownMenuItem>
                {folders.map(folder => (
                  <DropdownMenuItem key={folder.id} onSelect={() => onMoveNote(note.id, folder.id)}>
                    Move to {folder.name}
                  </DropdownMenuItem>
                ))}
                {note.folderId && (
                  <DropdownMenuItem onSelect={() => onMoveNote(note.id, null)}>
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

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        ['link', 'image', 'video'],
        ['code-block', 'blockquote'],
        ['clean']
      ],
    },
    theme: 'snow',
  })

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]')
    const savedFolders = JSON.parse(localStorage.getItem('folders') || '[]')
    setNotes(savedNotes)
    setFolders(savedFolders)
    if (savedNotes.length > 0) {
      setCurrentNote(savedNotes[0])
    }
  }, [])

  useEffect(() => {
    if (quill && currentNote) {
      quill.root.innerHTML = currentNote.content
      quill.on('text-change', () => {
        setCurrentNote(prev => prev ? {...prev, content: quill.root.innerHTML} : null)
      })
    }
  }, [quill, currentNote])

  const saveNote = () => {
    if (currentNote) {
      const updatedNotes = notes.map(note =>
        note.id === currentNote.id ? currentNote : note
      )
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
    }
  }

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      folderId: null
    }
    setNotes([...notes, newNote])
    setCurrentNote(newNote)
    localStorage.setItem('notes', JSON.stringify([...notes, newNote]))
  }

  const createNewFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: 'New Folder'
    }
    setFolders([...folders, newFolder])
    localStorage.setItem('folders', JSON.stringify([...folders, newFolder]))
  }

  const selectNote = (note: Note) => {
    saveNote()
    setCurrentNote(note)
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    if (currentNote && currentNote.id === noteId) {
      setCurrentNote(updatedNotes[0] || null)
    }
  }

  const deleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter(folder => folder.id !== folderId)
    setFolders(updatedFolders)
    localStorage.setItem('folders', JSON.stringify(updatedFolders))

    const updatedNotes = notes.map(note => 
      note.folderId === folderId ? {...note, folderId: null} : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  const renameNote = (noteId: string, newTitle: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, title: newTitle } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    if (currentNote && currentNote.id === noteId) {
      setCurrentNote({ ...currentNote, title: newTitle })
    }
  }

  const moveNote = (noteId: string, targetFolderId: string | null) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, folderId: targetFolderId } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    if (currentNote && currentNote.id === noteId) {
      setCurrentNote({ ...currentNote, folderId: targetFolderId })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        notes={notes}
        folders={folders}
        currentNote={currentNote} 
        onSelectNote={selectNote}
        onNewNote={createNewNote}
        onNewFolder={createNewFolder}
        onDeleteNote={deleteNote}
        onDeleteFolder={deleteFolder}
        onRenameNote={renameNote}
        onMoveNote={moveNote}
      />
      <div className="flex-1 flex flex-col">
        {currentNote && (
          <>
            <div className="bg-card p-4 flex justify-between items-center border-b">
              <Input
                value={currentNote.title}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                className="text-xl font-bold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Note Title"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={saveNote} variant="secondary">
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Note</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex-1 p-4">
              <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div ref={quillRef} className="h-full" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}