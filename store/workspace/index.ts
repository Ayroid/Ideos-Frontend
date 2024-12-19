import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Workspace, WorkspacesResponse } from "@/services/workspace";

interface WorkspaceState {
  activeWorkspace: Workspace | null;
  workspaces: WorkspacesResponse;
  isLoading: boolean;
  error: Error | null;
}

interface WorkspaceActions {
  setActiveWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: WorkspacesResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      workspaces: {
        personal: [],
        shared: [],
      },
      isLoading: false,
      error: null,

      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        activeWorkspace: state.activeWorkspace,
        workspaces: state.workspaces,
      }),
    },
  ),
);
