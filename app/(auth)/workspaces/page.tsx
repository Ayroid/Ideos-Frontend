"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Plus, Users } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceStore } from "@/store/workspace";
import { workspaceService } from "@/services/workspace";
import type { Workspace } from "@/services/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
  onSelect: (workspace: Workspace) => void;
}

const WorkspaceCard = ({ workspace, onSelect }: WorkspaceCardProps) => (
  <Card
    className="group relative cursor-pointer overflow-hidden p-6 transition-all hover:shadow-lg"
    onClick={() => onSelect(workspace)}
  >
    <div className="flex items-center gap-4">
      {workspace.logo ? (
        <img
          src={workspace.logo}
          alt={workspace.name}
          className="h-12 w-12 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
      )}
      <div>
        <h3 className="font-semibold">{workspace.name}</h3>
        <p className="text-sm text-muted-foreground">
          {workspace.members.length} member
          {workspace.members.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
    <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-gradient-to-l from-background/80 via-background/60 to-transparent px-4 opacity-0 transition-opacity group-hover:opacity-100">
      <Users className="h-5 w-5 text-muted-foreground" />
    </div>
  </Card>
);

export default function WorkspacesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useKindeBrowserClient();
  const {
    workspaces,
    isLoading,
    setActiveWorkspace,
    setWorkspaces,
    setLoading,
    setError
  } = useWorkspaceStore();

  React.useEffect(() => {
    const fetchWorkspaces = async () => {
      if (isAuthLoading || !isAuthenticated) return;

      setLoading(true);
      try {
        const data = await workspaceService.getWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        setError(error instanceof Error ? error : new Error("Failed to fetch workspaces"));
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [isAuthenticated, isAuthLoading]);

  const handleWorkspaceSelect = async (workspace: Workspace) => {
    try {
      const updatedWorkspace = await workspaceService.setActiveWorkspace(workspace._id);
      setActiveWorkspace(updatedWorkspace);
      router.push(`/workspaces/${workspace._id}`);
    } catch (error) {
      console.error("Error setting active workspace:", error);
      // Still redirect even if setting active workspace fails
      router.push(`/workspaces/${workspace._id}`);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Workspaces</h1>
          {/* <Button
            onClick={() => router.push('/workspaces/new')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Workspace
          </Button> */}
        </div>

        <Separator />

        {/* Personal Workspaces */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Workspaces</h2>
            <p className="text-sm text-muted-foreground">
              {workspaces.personal.length} workspace
              {workspaces.personal.length !== 1 ? "s" : ""}
            </p>
          </div>
          {workspaces.personal.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.personal.map((workspace) => (
                <WorkspaceCard
                  key={workspace._id}
                  workspace={workspace}
                  onSelect={handleWorkspaceSelect}
                />
              ))}
            </div>
          ) : (
            <Card className="flex items-center justify-center p-8 text-muted-foreground">
              No personal workspaces yet
            </Card>
          )}
        </section>

        {/* Shared Workspaces */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Shared Workspaces</h2>
            <p className="text-sm text-muted-foreground">
              {workspaces.shared.length} workspace
              {workspaces.shared.length !== 1 ? "s" : ""}
            </p>
          </div>
          {workspaces.shared.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.shared.map((workspace) => (
                <WorkspaceCard
                  key={workspace._id}
                  workspace={workspace}
                  onSelect={handleWorkspaceSelect}
                />
              ))}
            </div>
          ) : (
            <Card className="flex items-center justify-center p-8 text-muted-foreground">
              No shared workspaces yet
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}