"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Folder, FileText, FolderPlus, Save, ImageIcon, Code, Eye, Bold, Italic, Underline, List, ListOrdered, Link, Heading1, Heading2, Heading3, Quote, Search, Loader2, ChevronDown, MoreVertical, Layout } from 'lucide-react'
import { NoteItem } from './NoteItem'
import { FolderItem } from './FolderItem'
import { convertHtmlToMarkup, convertMarkupToHtml } from "@/utils/conversions"
import axios from 'axios'
import { Note, Folder as FolderType, Workspace } from "@/types/notetaking/index"
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'

interface NoteTakingAppProps {
  workspaceId: string
}

export default function NoteTakingApp({ workspaceId }: NoteTakingAppProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<FolderType[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [renderedContent, setRenderedContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const { theme } = useTheme()

  const fetchNotesAndFolders = useCallback(async (workspaceId: string) => {
    try {
      const [notesResponse, foldersResponse] = await Promise.all([
        axios.get(`/api/notetaking/workspaces/${workspaceId}/notes`),
        axios.get(`/api/notetaking/workspaces/${workspaceId}/folders`)
      ])

      if (notesResponse.status === 200) {
        const notesData = notesResponse.data || []
        setNotes(notesData)
        if (notesData.length > 0) {
          setCurrentNote(notesData[0])
        } else {
          setCurrentNote(null)
        }
      } else {
        console.error("Failed to fetch notes:", notesResponse.status)
        setNotes([])
        setCurrentNote(null)
      }

      if (foldersResponse.status === 200) {
        setFolders(foldersResponse.data || [])
      } else {
        console.error("Failed to fetch folders:", foldersResponse.status)
        setFolders([])
      }
    } catch (error) {
      console.error("Failed to fetch notes and folders:", error)
      setNotes([])
      setFolders([])
      setCurrentNote(null)
    }
  }, [])

  useEffect(() => {
    fetchNotesAndFolders(workspaceId)
  }, [fetchNotesAndFolders, workspaceId])

  useEffect(() => {
    if (currentNote) {
      if (isPreview) {
        renderContent(currentNote.content, currentNote.isMarkup)
      } else {
        setRenderedContent(currentNote.content)
      }
    }
  }, [currentNote, isPreview])

  const renderContent = useCallback((content: string, isMarkup: boolean) => {
    if (isMarkup) {
      setRenderedContent(convertMarkupToHtml(content))
    } else {
      setRenderedContent(content)
    }
  }, [])

  const saveNote = async () => {
    if (currentNote && !isSaving) {
      try {
        setIsSaving(true)
        const response = await axios.put(`/api/notetaking/notes/${currentNote._id}/save`, currentNote)
        const updatedNotes = notes.map(note => note._id === currentNote._id ? { ...currentNote, ...response.data } : note)
        setNotes(updatedNotes)
        if (currentNote._id === response.data._id) {
          setCurrentNote(response.data)
        }
        setTimeout(() => setIsSaving(false), 1000)
      } catch (error) {
        console.error("Failed to save the note:", error)
        setIsSaving(false)
      }
    }
  }

  const createNewNote = useCallback(async () => {
    try {
      const newNote = {
        title: "Untitled Note",
        content: " ",
        folderId: null,
        isMarkup: false,
      }
      const response = await axios.post("/api/notetaking/notes", newNote)
      const createdNote = response.data
      setNotes(prevNotes => [...prevNotes, createdNote])
      setCurrentNote(createdNote)
    } catch (error) {
      console.error("Failed to create a new note:", error)
    }
  }, [])

  const createNewFolder = async () => {
    try {
      const newFolderData = {
        name: "New Folder",
        workspaceId: workspaceId,
      }
      const response = await axios.post("/api/notetaking/folders", newFolderData)
      const createdFolder = response.data
      setFolders(prevFolders => [...prevFolders, createdFolder])
    } catch (error) {
      console.error("Failed to create a new folder:", error)
    }
  }

  const selectNote = (note: Note) => {
    setCurrentNote(note)
    setIsPreview(false)
  }

  const deleteNote = async (noteId: string) => {
    try {
      await axios.delete(`/api/notetaking/notes/${noteId}`)
      const updatedNotes = notes.filter(note => note._id !== noteId)
      setNotes(updatedNotes)
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote(updatedNotes[0] || null)
      }
    } catch (error) {
      console.error("Failed to delete the note:", error)
    }
  }

  const deleteFolder = async (folderId: string) => {
    try {
      await axios.delete(`/api/notetaking/folders/${folderId}?workspaceId=${workspaceId}`)
      const updatedFolders = folders.filter(folder => folder._id !== folderId)
      setFolders(updatedFolders)
      const updatedNotes = notes.map(note => note.folderId === folderId ? { ...note, folderId: null } : note)
      setNotes(updatedNotes)
    } catch (error) {
      console.error("Failed to delete the folder:", error)
    }
  }

  const renameNote = async (noteId: string, newTitle: string) => {
    try {
      await axios.put(`/api/notetaking/notes/${noteId}`, { newTitle })
      const updatedNotes = notes.map(note => note._id === noteId ? { ...note, title: newTitle } : note)
      setNotes(updatedNotes)
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote({ ...currentNote, title: newTitle })
      }
    } catch (error) {
      console.error("Failed to rename the note:", error)
    }
  }

  const renameFolder = async (folderId: string, newName: string) => {
    try {
      await axios.put(`/api/notetaking/folders/${folderId}`, { newName })
      const updatedFolders = folders.map(folder => folder._id === folderId ? { ...folder, name: newName } : folder)
      setFolders(updatedFolders)
    } catch (error) {
      console.error("Failed to rename the folder:", error)
    }
  }

  const moveNote = async (noteId: string, targetFolderId: string | null) => {
    try {
      const response = await axios.put(`/api/notetaking/notes/${noteId}/move`, { folderId: targetFolderId })
      const updatedNotes = notes.map(note => note._id === noteId ? { ...note, folderId: targetFolderId } : note)
      setNotes(updatedNotes)
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote({ ...currentNote, folderId: targetFolderId })
      }
    } catch (error) {
      console.error("Failed to move the note:", error)
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
          const updatedContent = currentNote.content + "\n" + imageElement
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

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined && currentNote) {
      setCurrentNote({ ...currentNote, content: value })
      if (isPreview) {
        renderContent(value, currentNote.isMarkup)
      }
    }
  }

  const applyFormatting = (format: string) => {
    if (currentNote?.isMarkup) {
      const editor = editorRef.current
      if (editor) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const selectedText = range.toString()
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
              formattedText = `[${selectedText}](${url})`
              break
            default:
              formattedText = selectedText
          }

          range.deleteContents()
          range.insertNode(document.createTextNode(formattedText))
          handleContentChange(editor.innerHTML)
        }
      }
    } else {
      document.execCommand(format)
    }
  }

  const createNewWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      title: name,
      createdAt: new Date().toISOString(),
    }
    setWorkspaces([...workspaces, newWorkspace])
    setCurrentWorkspace(newWorkspace)
  }

  const switchWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace)
    // Fetch notes and folders for the selected workspace
    fetchNotesAndFolders(workspaceId)
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-lg font-semibold">Notes</h1>
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
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-4 p-4">
            {folders.map((folder) => (
              <FolderItem
                key={folder._id}
                folder={folder}
                notes={notes}
                currentNote={currentNote}
                folders={folders}
                onSelectNote={selectNote}
                onRenameNote={renameNote}
                onDeleteNote={deleteNote}
                onMoveNote={moveNote}
                onRename={renameFolder}
                onDelete={deleteFolder}
              />
            ))}
            <div className="space-y-2">
              <div className="flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                <span className="font-medium">Uncategorized</span>
              </div>
              <ul className="space-y-1">
                {notes
                  .filter((note) => note.folderId === null)
                  .filter((note) =>
                    note.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((note) => (
                    <NoteItem
                      key={note._id}
                      note={note}
                      currentNote={currentNote}
                      folders={folders}
                      onSelect={selectNote}
                      onRename={renameNote}
                      onDelete={deleteNote}
                      onMove={moveNote}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              {currentWorkspace ? currentWorkspace.title : "My Workspace"}
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layout className="mr-2 h-4 w-4" />
                  Workspaces
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Workspaces</DialogTitle>
                  <DialogDescription>
                    View all workspaces or create a new one.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="New workspace name"
                      id="new-workspace-name"
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "new-workspace-name"
                        ) as HTMLInputElement
                        if (input.value) {
                          createNewWorkspace(input.value)
                          input.value = ""
                        }
                      }}
                    >
                      Create
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {workspaces.map((workspace) => (
                        <div
                          key={workspace.id}
                          className="flex items-center justify-between rounded-lg border p-2"
                        >
                          <span>{workspace.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => switchWorkspace(workspace)}
                          >
                            Switch
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {currentNote && (
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
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
              <Button onClick={saveNote} variant="default" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </header>
        {currentNote ? (
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <Input
                value={currentNote.title}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, title: e.target.value })
                }
                className="border-none bg-transparent text-xl font-bold focus-visible:ring-0"
                placeholder="Untitled Note"
              />
              {isPreview ? (
                <ScrollArea className="flex-1">
                  <div className="prose dark:prose-invert max-w-none p-8">
                    <div
                      dangerouslySetInnerHTML={{ __html: renderedContent }}
                    />
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-1 flex-col">
                  <div className="flex space-x-1 border-b bg-muted/40 p-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Paragraph
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => applyFormatting("h1")}>
                          Heading 1
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => applyFormatting("h2")}>
                          Heading 2
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => applyFormatting("h3")}>
                          Heading 3
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("bold")}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("italic")}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("underline")}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("ordered-list")}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("quote")}
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => applyFormatting("link")}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <div className="flex-1" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Find and Replace</DropdownMenuItem>
                        <DropdownMenuItem>Word Count</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {currentNote.isMarkup ? (
                      <div className="h-full border-t border-border">
                        <Editor
                          height="100%"
                          defaultLanguage="markdown"
                          value={currentNote.content}
                          onChange={handleContentChange}
                          theme={theme === "dark" ? "vs-dark" : "light"}
                          options={{
                            minimap: { enabled: false },
                            wordWrap: "on",
                            wrappingIndent: "indent",
                            lineNumbers: "off",
                            folding: false,
                            lineDecorationsWidth: 0,
                            lineNumbersMinChars: 0,
                            glyphMargin: false,
                            padding: { top: 16, bottom: 16 },
                            scrollBeyondLastLine: false,
                            overviewRulerLanes: 0,
                            overviewRulerBorder: false,
                          }}
                          className="markdown-editor"
                        />
                      </div>
                    ) : (
                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning={true}
                        onInput={(e) => handleContentChange((e.target as HTMLDivElement).innerHTML)}
                        dangerouslySetInnerHTML={{ __html: currentNote.content }}
                        className="min-h-full w-full resize-none overflow-auto p-4 focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-4 text-muted-foreground" />
              <h2 className="mt-2 text-xl font-semibold">No Note Selected</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a note or create a new one to get started
              </p>
              <Button className="mt-4" onClick={createNewNote}>
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}