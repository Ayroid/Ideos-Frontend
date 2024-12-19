"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateWorkspace = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkExistingWorkspaces();
  }, []);

  const checkExistingWorkspaces = async () => {
    try {
      const response = await fetch("/api/workspaces", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Workspace data:", data);

      if (response.ok && data.length > 0) {
        router.push(`/workspaces/${data[0]._id}`);
        return;
      }
    } catch (error) {
      console.error("Error checking workspaces:", error);
      toast.error("Failed to check existing workspaces");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!workspaceName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: workspaceName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create workspace");
      }

      toast.success("Workspace created successfully!");
      router.push(`/workspaces/${data._id}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create workspace");
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