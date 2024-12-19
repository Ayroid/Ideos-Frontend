"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Building2, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "@/store/workspace";
import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import axios from "axios";

interface CreateNotebookFormData {
  title: string;
  description: string;
}

export default function NotesPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNotebookFormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { activeWorkspace } = useWorkspaceStore();

  useEffect(() => {
    const checkExistingNotebook = async () => {
      try {
        const response = await axios.get("/api/notetaking/notebooks");
        const notebook = response.data[0];

        if (notebook && notebook._id) {
          router.push(
            `/workspaces/${activeWorkspace?._id}/notetaking/${notebook._id}`,
          );
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking notebook:", error);
        setIsLoading(false);
        toast.error("Failed to check existing notebooks");
      }
    };

    checkExistingNotebook();
  }, [router]);

  const createNotebook = useCallback(
    async (data: CreateNotebookFormData) => {
      setIsCreating(true);

      try {
        const response = await axios.post("/api/notetaking/notebooks", {
          title: data.title,
          description: data.description || "",
        });

        if (response.data && response.data._id) {
          toast.success("Notebook created successfully");
          router.push(
            `/workspace/${activeWorkspace?._id}/notetaking/${response.data._id}`,
          );
        } else {
          toast.error("Failed to create notebook");
        }
      } catch (error: any) {
        console.error("Error creating notebook:", error);
        toast.error(
          error.response?.data?.error ||
            "Failed to create notebook. Please try again.",
        );
      } finally {
        setIsCreating(false);
        reset();
      }
    },
    [router, reset],
  );

  const onSubmit: SubmitHandler<CreateNotebookFormData> = (data) => {
    createNotebook(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again.</div>}
    >
      <div className="flex items-center justify-center bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <header className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Create new notebook</h1>
            </header>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Setup your notebook</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Notebook Name</Label>
                  <Input
                    id="title"
                    placeholder="Enter notebook name"
                    {...register("title", {
                      required: "Notebook name is required",
                    })}
                    className="h-12"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your notebook"
                    className="h-32 resize-none"
                    {...register("description")}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Notebook
                    </>
                  )}
                </Button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
