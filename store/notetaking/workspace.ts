import { create } from 'zustand';
import { File, Folder, Workspace } from '../../types/notetaking/index'; 

type AppFoldersType = Folder & { files: File[] | [] };
type AppWorkspacesType = Workspace & { folders: AppFoldersType[] | [] };

interface State {
  workspaces: AppWorkspacesType[];
}

interface Actions {
  addWorkspace: (workspace: AppWorkspacesType) => void;
  deleteWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspaceId: string, updatedWorkspace: Partial<AppWorkspacesType>) => void;
  setWorkspaces: (workspaces: AppWorkspacesType[]) => void;
  setFolders: (workspaceId: string, folders: AppFoldersType[]) => void;
  addFolder: (workspaceId: string, folder: AppFoldersType) => void;
  updateFolder: (workspaceId: string, folderId: string, updatedFolder: Partial<AppFoldersType>) => void;
  deleteFolder: (workspaceId: string, folderId: string) => void;
  setFiles: (workspaceId: string, folderId: string, files: File[]) => void;
  addFile: (workspaceId: string, folderId: string, file: File) => void;
  deleteFile: (workspaceId: string, folderId: string, fileId: string) => void;
  updateFile: (workspaceId: string, folderId: string, fileId: string, updatedFile: Partial<File>) => void;
}

type WorkspaceStore = State & Actions;

const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],

  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),

  deleteWorkspace: (workspaceId) =>
    set((state) => ({
      workspaces: state.workspaces.filter((ws) => ws.id !== workspaceId),
    })),

  updateWorkspace: (workspaceId, updatedWorkspace) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? { ...ws, ...updatedWorkspace } : ws
      ),
    })),

  setWorkspaces: (workspaces) => set(() => ({ workspaces })),

  setFolders: (workspaceId, folders) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? { ...ws, folders: folders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) } : ws
      ),
    })),

  addFolder: (workspaceId, folder) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? { ...ws, folders: [...ws.folders, folder].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) } : ws
      ),
    })),

  updateFolder: (workspaceId, folderId, updatedFolder) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? {
          ...ws,
          folders: ws.folders.map((folder) =>
            folder.id === folderId ? { ...folder, ...updatedFolder } : folder
          ),
        } : ws
      ),
    })),

  deleteFolder: (workspaceId, folderId) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? { ...ws, folders: ws.folders.filter((folder) => folder.id !== folderId) } : ws
      ),
    })),

  setFiles: (workspaceId, folderId, files) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? {
          ...ws,
          folders: ws.folders.map((folder) =>
            folder.id === folderId ? { ...folder, files } : folder
          ),
        } : ws
      ),
    })),

  addFile: (workspaceId, folderId, file) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? {
          ...ws,
          folders: ws.folders.map((folder) =>
            folder.id === folderId ? {
              ...folder,
              files: [...folder.files, file].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            } : folder
          ),
        } : ws
      ),
    })),

  deleteFile: (workspaceId, folderId, fileId) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? {
          ...ws,
          folders: ws.folders.map((folder) =>
            folder.id === folderId ? {
              ...folder,
              files: folder.files.filter((file) => file.id !== fileId)
            } : folder
          ),
        } : ws
      ),
    })),

  updateFile: (workspaceId, folderId, fileId, updatedFile) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === workspaceId ? {
          ...ws,
          folders: ws.folders.map((folder) =>
            folder.id === folderId ? {
              ...folder,
              files: folder.files.map((file) =>
                file.id === fileId ? { ...file, ...updatedFile } : file
              ),
            } : folder
          ),
        } : ws
      ),
    })),
}));

export { useWorkspaceStore };
export type { WorkspaceStore };
