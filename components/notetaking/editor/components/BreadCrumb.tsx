import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Note, Folder, Workspace } from '@/types/notetaking';

interface BreadcrumbProps {
  currentNote: Note | null;
  folders: Folder[];
  workspace: Workspace | null;
}

export default function Breadcrumb({ currentNote, folders, workspace }: BreadcrumbProps) {
  if (!currentNote) return null;

  const currentFolder = folders.find(
    (folder) => folder._id === currentNote.folderId
  );

  return (
    <div className="flex items-center text-sm">
      <span className="text-[#888]">{workspace?.title || 'My Workspace'}</span>
      <ChevronRight className="h-4 w-4 mx-1 text-[#666]" />
      {currentFolder && (
        <>
          <span className="text-[#888]">{currentFolder.name}</span>
          <ChevronRight className="h-4 w-4 mx-1 text-[#666]" />
        </>
      )}
      <span className="text-white">{currentNote.title}</span>
    </div>
  );
}