"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/workspace";
import { workspaceService } from "@/services/workspace";

const CreateWorkspace = () => {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    workspaces,
    setWorkspaces,
    setActiveWorkspace,
    isLoading,
    setLoading,
    setError
  } = useWorkspaceStore();

  React.useEffect(() => {
    const checkExistingWorkspaces = async () => {
      setLoading(true);
      try {
        const data = await workspaceService.getWorkspaces();
        setWorkspaces(data);

        // If there are existing workspaces, redirect to the first one
        if (data.personal.length > 0 || data.shared.length > 0) {
          const firstWorkspace = data.personal[0] || data.shared[0];
          router.push(`/workspaces/${firstWorkspace._id}`);
          return;
        }
      } catch (error) {
        console.error("Error checking workspaces:", error);
        toast.error("Failed to check existing workspaces");
        setError(error instanceof Error ? error : new Error("Failed to check workspaces"));
      } finally {
        setLoading(false);
      }
    };

    checkExistingWorkspaces();
  }, []);

  const handleSubmit = async () => {
    if (!workspaceName.trim()) return;

    setIsSubmitting(true);
    try {
      // Create the workspace
      const newWorkspace = await workspaceService.createWorkspace(workspaceName);

      // Update store with new workspace
      setWorkspaces({
        ...workspaces,
        personal: [...workspaces.personal, newWorkspace]
      });

      // Set as active workspace
      await workspaceService.setActiveWorkspace(newWorkspace._id);
      setActiveWorkspace(newWorkspace);

      toast.success("Workspace created successfully!");
      router.push(`/workspaces/${newWorkspace._id}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create workspace");
      setError(error instanceof Error ? error : new Error("Failed to create workspace"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full space-y-6 p-4 min-h-screen pt-20 md:pt-32 px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <Image
            src="/ideos.png"
            alt="Logo"
            height="80"
            width="80"
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-20"
          />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold px-4">
            What should we call{' '}
            <span className="hidden sm:inline">
              <br />
            </span>
            your workspace?
          </h1>
          <p className="text-sm sm:text-md text-muted-foreground px-4">
            You can always change this later from settings.
          </p>
        </div>

        <div className="mx-auto max-w-md space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace Name</label>
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="h-10 sm:h-12"
              onKeyDown={(e) => {
                if (e.key === "Enter" && workspaceName.trim()) {
                  handleSubmit();
                }
              }}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!workspaceName.trim() || isSubmitting}
            className="w-full h-10 sm:h-12 text-base"
          >
            {isSubmitting ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CreateWorkspace;