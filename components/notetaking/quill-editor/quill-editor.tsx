"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Folder, FileText, FolderPlus, Trash, MoreVertical, Save, ImageIcon, Code, Eye, Bold, Italic, Underline, List, ListOrdered, Link, Heading1, Heading2, Heading3, Quote, Search, Loader2 } from 'lucide-react'
import { useDebounce } from 'use-debounce'

interface Note {
  id: string
  title: string
  content: string
  folderId: string | null
  isMarkup: boolean
}

interface Folder {
  id: string
  name: string
}

const convertHtmlToMarkup = (html: string): string => {
  return html
    .replace(/<p>(.*?)<\/p>/g, '$1\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '_$1_')
    .replace(/<u>(.*?)<\/u>/g, '~~$1~~')
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
    .replace(/<li>(.*?)<\/li>/g, '- $1\n')
    .replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1\n')
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[[$1|$2]]')
    .replace(/<img src="(.*?)" alt="(.*?)" width="(\d+)" height="(\d+)">/g, '![$2]($1 ==$3x$4)')
}

const convertMarkupToHtml = (markup: string): string => {
  return markup
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~~(.*?)~~/g, '<u>$1</u>')
    .replace(/# (.*)\n/g, '<h1>$1</h1>')
    .replace(/## (.*)\n/g, '<h2>$1</h2>')
    .replace(/### (.*)\n/g, '<h3>$1</h3>')
    .replace(/- (.*)\n/g, '<li>$1</li>')
    .replace(/> (.*)\n/g, '<blockquote>$1</blockquote>')
    .replace(/\[\[(.*?)\|(.*?)\]\]/g, '<a href="$1">$2</a>')
    .replace(/!\[(.*?)\]$$(.*?) ==(\d+)x(\d+)$$/g, '<img src="$2" alt="$1" width="$3" height="$4">')
}

const ResizableImage: React.FC<{ src: string; alt: string; initialWidth: number; initialHeight: number }> = ({ src, alt, initialWidth, initialHeight }) => {
  const [width, setWidth] = useState(initialWidth)
  const [height, setHeight] = useState(initialHeight)
  const [isResizing, setIsResizing] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && imageRef.current) {
      const newWidth = e.clientX - imageRef.current.getBoundingClientRect().left
      const aspectRatio = initialWidth / initialHeight
      setWidth(newWidth)
      setHeight(newWidth / aspectRatio)
    }
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <div className="relative inline-block">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full h-auto"
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [renderedContent, setRenderedContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [debouncedContent] = useDebounce(currentNote?.content, 1000)

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]')
    const savedFolders = JSON.parse(localStorage.getItem('folders') || '[]')
    setNotes(savedNotes)
    setFolders(savedFolders)
    if (savedNotes.length > 0) {
      setCurrentNote(savedNotes[0])
    } else {
      createNewNote()
    }
  }, [])

  useEffect(() => {
    if (currentNote && isPreview) {
      renderContent(currentNote.content, currentNote.isMarkup)
    }
  }, [currentNote, isPreview])

  useEffect(() => {
    if (debouncedContent) {
      saveNote()
    }
  }, [debouncedContent])

  const renderContent = useCallback((content: string, isMarkup: boolean) => {
    if (isMarkup) {
      setRenderedContent(convertMarkupToHtml(content))
    } else {
      setRenderedContent(content)
    }
  }, [])

  const saveNote = () => {
    if (currentNote) {
      setIsSaving(true)
      const updatedNotes = notes.map(note =>
        note.id === currentNote.id ? currentNote : note
      )
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
      setTimeout(() => setIsSaving(false), 500) // Simulate a short delay for saving
    }
  }

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      folderId: null,
      isMarkup: false
    }
    setNotes(prevNotes => [...prevNotes, newNote])
    setCurrentNote(newNote)
    localStorage.setItem('notes', JSON.stringify([...notes, newNote]))
  }

  const createNewFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: 'New Folder'
    }
    setFolders(prevFolders => [...prevFolders, newFolder])
    localStorage.setItem('folders', JSON.stringify([...folders, newFolder]))
  }

  const selectNote = (note: Note) => {
    saveNote()
    setCurrentNote(note)
    setIsPreview(false)
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

  const renameFolder = (folderId: string, newName: string) => {
    const updatedFolders = folders.map(folder =>
      folder.id === folderId ? { ...folder, name: newName } : folder
    )
    setFolders(updatedFolders)
    localStorage.setItem('folders', JSON.stringify(updatedFolders))
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && currentNote) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const imageElement = currentNote.isMarkup
            ? `![${file.name}](${reader.result} ==${img.width}x${img.height})`
            : `<img src="${reader.result}" alt="${file.name}" width="${img.width}" height="${img.height}">`
          const updatedContent = currentNote.content + '\n' + imageElement
          setCurrentNote({ ...currentNote, content: updatedContent })
          if (isPreview) {
            renderContent(updatedContent, currentNote.isMarkup)
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleMarkup = () => {
    if (currentNote) {
      const newIsMarkup = !currentNote.isMarkup
      let newContent = currentNote.content

      if (newIsMarkup) {
        newContent = convertHtmlToMarkup(newContent)
      } else {
        newContent = convertMarkupToHtml(newContent)
      }

      setCurrentNote({ ...currentNote, isMarkup: newIsMarkup, content: newContent })
      setIsPreview(false)
    }
  }

  const handleContentChange = (value: string) => {
    if (currentNote) {
      setCurrentNote({ ...currentNote, content: value })
      if (isPreview) {
        renderContent(value, currentNote.isMarkup)
      }
    }
  }

  const applyFormatting = (format: string) => {
    if (currentNote?.isMarkup) {
      const textarea = document.getElementById('note-content') as HTMLTextAreaElement
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      let formattedText = ''

      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`
          break
        case 'italic':
          formattedText = `_${selectedText}_`
          break
        case 'underline':
          formattedText = `~~${selectedText}~~`
          break
        case 'h1':
          formattedText = `# ${selectedText}`
          break
        case 'h2':
          formattedText = `## ${selectedText}`
          break
        case 'h3':
          formattedText = `### ${selectedText}`
          break
        case 'list':
          formattedText = `\n- ${selectedText}`
          break
        case 'ordered-list':
          formattedText = `\n1. ${selectedText}`
          break
        case 'quote':
          formattedText = `> ${selectedText}`
          break
        case 'link':
          const url = prompt('Enter the URL:')
          formattedText = `[[${url}|${selectedText}]]`
          break
        default:
          formattedText = selectedText
      }

      const newContent = 
        textarea.value.substring(0, start) +
        formattedText +
        textarea.value.substring(end)

      setCurrentNote({ ...currentNote, content: newContent })
      if (isPreview) {
        renderContent(newContent, true)
      }
    } else {
      document.execCommand(format)
    }
  }

  const NoteItem: React.FC<{ note: Note }> = ({ note }) => {
    const [isRenaming, setIsRenaming] = useState(false)
    const [newTitle, setNewTitle] = useState(note.title)

    return (
      <li 
        className={`flex items-center justify-between p-2 rounded-md transition-colors duration-200 ${
          currentNote && currentNote.id === note.id ? 'bg-secondary' : 'hover:bg-secondary'
        }`}
      >
        {isRenaming ? (
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => {
              renameNote(note.id, newTitle)
              setIsRenaming(false)
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                renameNote(note.id, newTitle)
                setIsRenaming(false)
              }
            }}
            className="h-6 text-sm"
            autoFocus
          />
        ) : (
          <>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => selectNote(note)}>
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
                  <DropdownMenuItem onSelect={() => deleteNote(note.id)}>
                    Delete
                  </DropdownMenuItem>
                  {folders.map(folder => (
                    <DropdownMenuItem key={folder.id} onSelect={() => moveNote(note.id, folder.id)}>
                      Move to {folder.name}
                    </DropdownMenuItem>
                  ))}
                  {note.folderId && (
                    <DropdownMenuItem onSelect={() => moveNote(note.id, null)}>
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

  const FolderItem: React.FC<{ folder: Folder }> = ({ folder }) => {
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
                renameFolder(folder.id, newName)
                setIsRenaming(false)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  renameFolder(folder.id, newName)
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
                    onClick={() => deleteFolder(folder.id)}
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
            .filter(note => note.folderId === folder.id)
            .map(note => (
              <NoteItem key={note.id} note={note} />
            ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-muted text-foreground">
      <ScrollArea className="w-64 bg-secondary h-screen">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Notes</h2>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={createNewNote}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Note</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={createNewFolder}>
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Folder</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Separator />
          {folders.map(folder => (
            <FolderItem key={folder.id} folder={folder} />
          ))}
          <div className="space-y-2">
            <div className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              <span className="font-medium">Uncategorized</span>
            </div>
            <ul className="space-y-1 ml-6">
              {notes
                .filter(note => note.folderId === null)
                .filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(note => (
                  <NoteItem key={note.id} note={note} />
                ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
      {currentNote ? (
        <div className="flex-1 flex flex-col">
          <div className="bg-secondary p-4 flex justify-between items-center">
            <Input
              value={currentNote.title}
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              className="text-xl font-bold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Untitled Note"
            />
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => document.getElementById('image-upload')?.click()}>
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload Image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={currentNote.isMarkup}
                      onPressedChange={toggleMarkup}
                      aria-label="Toggle Markup"
                    >
                      <Code className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Markup</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={isPreview}
                      onPressedChange={setIsPreview}
                      aria-label="Toggle Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Preview</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={saveNote} variant="default" disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Note</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {isPreview ? (
              <div className="h-full p-4 overflow-auto">
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="bg-secondary p-2 flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('bold')}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('italic')}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('underline')}>
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('h1')}>
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('h2')}>
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('h3')}>
                    <Heading3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('insertUnorderedList')}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('insertOrderedList')}>
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('formatBlock')}>
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => applyFormatting('createLink')}>
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
                {currentNote.isMarkup ? (
                  <textarea
                    id="note-content"
                    value={currentNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="flex-1 w-full resize-none focus:outline-none p-4 font-mono bg-background"
                    placeholder="Start writing your note here..."
                  />
                ) : (
                  <div
                    ref={editorRef}
                    id="note-content"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: currentNote.content }}
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement
                      const selection = window.getSelection()
                      const range = selection?.getRangeAt(0)
                      handleContentChange(target.innerHTML)
                      if (selection && range) {
                        selection.removeAllRanges()
                        selection.addRange(range)
                      }
                    }}
                    className="flex-1 w-full resize-none bg-muted focus:outline-none p-4 overflow-auto"
                    style={{ minHeight: '1em' }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Select a note or create a new one to get started</p>
        </div>
      )}
    </div>
  )
}