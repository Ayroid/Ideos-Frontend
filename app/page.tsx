"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useWorkspaceStore } from "@/store/workspace";
import { workspaceService } from "@/services/workspace";

const Page = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useKindeBrowserClient();
  const { setActiveWorkspace, setWorkspaces, setLoading, setError, isLoading } =
    useWorkspaceStore();

  React.useEffect(() => {
    const initializeWorkspaces = async () => {
      if (isAuthLoading) return;

      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      setLoading(true);
      try {
        const activeWorkspace = await workspaceService.getActiveWorkspace();
        if (activeWorkspace) {
          setActiveWorkspace(activeWorkspace);
          router.push(`/workspaces/${activeWorkspace.name.toLowerCase()}`);
          return;
        }

        const workspaces = await workspaceService.getWorkspaces();
        setWorkspaces(workspaces);

        if (workspaces.personal.length > 0) {
          const workspace = await workspaceService.setActiveWorkspace(
            workspaces.personal[0]._id,
          );
          setActiveWorkspace(workspace);
          router.push(`/workspaces/${workspace.name.toLowerCase()}`);
        } else if (workspaces.shared.length > 0) {
          const workspace = await workspaceService.setActiveWorkspace(
            workspaces.shared[0]._id,
          );
          setActiveWorkspace(workspace);
          router.push(`/workspaces/${workspace.name.toLowerCase()}`);
        } else {
          router.push("/workspaces");
        }
      } catch (error) {
        console.error("Error initializing workspaces:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to initialize workspaces"),
        );
        router.push("/workspaces");
      } finally {
        setLoading(false);
      }
    };

    initializeWorkspaces();
  }, [isAuthenticated, isAuthLoading]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
};

export default Page;
