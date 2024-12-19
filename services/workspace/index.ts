interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Workspace {
  _id: string;
  name: string;
  logo?: string;
  userId: string;
  members: User[];
}

export interface WorkspacesResponse {
  personal: Workspace[];
  shared: Workspace[];
}

export const workspaceService = {
  getWorkspaces: async (): Promise<WorkspacesResponse> => {
    const response = await fetch("/api/workspaces", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch workspaces");
    return response.json();
  },

  getActiveWorkspace: async (): Promise<Workspace | null> => {
    const response = await fetch("/api/workspaces/active");
    if (!response.ok) return null;
    return response.json();
  },

  setActiveWorkspace: async (workspaceId: string): Promise<Workspace> => {
    const response = await fetch("/api/workspaces/active", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId }),
    });

    if (!response.ok) throw new Error("Failed to set active workspace");
    return response.json();
  },

  createWorkspace: async (name: string): Promise<Workspace> => {
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to create workspace");
    return response.json();
  },
};
