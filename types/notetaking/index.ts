import { Socket, Server as NetServer } from 'net';
import { NextApiResponse } from 'next';
import { z } from 'zod';

// Define schemas for the forms used in your project

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe('Workspace Name')
    .min(1, 'Workspace name must be at least 1 character'),
  logo: z.any().optional(), 
});

export const UploadBannerFormSchema = z.object({
  banner: z.string().describe('Banner Image').optional(), // Optional since it's not always required
});

// Type for File
export type File = {
  id: string;
  name: string;
  size: number;
  content?: string;
  type: string;
  url: string; // URL to access the file
  createdAt: string; // Add createdAt if needed
};

// Type for Folder
export type Folder = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  files: File[]; // Array of files within the folder
};

// Type for Workspace
export type Workspace = {
  id: string;
  title: string;
  logo: string | null;
  iconId: string;
  createdAt: string;
  inTrash: boolean;
  workspaceOwner: string;
  bannerUrl: string;
  data: any; // Customize as needed
  folders: Folder[]; // Array of folders within the workspace
};

// Type for Zustand store state
export type WorkspaceStoreState = {
  workspaces: Workspace[];
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (workspaceId: string) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
};


