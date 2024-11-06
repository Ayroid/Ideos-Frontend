"use client";

import React, { useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Briefcase, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorBoundary } from "react-error-boundary";
import axios from "axios";

// Updated Workspace interface to match the backend WorkspaceModel schema
interface Workspace {
  _id: string;  // MongoDB uses _id instead of id
  userId: string;  // Referenced user ID in the backend model
  title: string;
  description?: string;
  theme: string;
  createdAt: string;  // Date string, matches backend model
  folders: string[];  // Array of folder IDs
}

interface CreateWorkspaceFormData {
  title: string;
  description: string;
  theme: string;
}

const colorThemes = [
  { value: "slate", label: "Slate" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
];

export default function WorkspaceCreation() {
  const router = useRouter();
  const [previousWorkspaces, setPreviousWorkspaces] = useState<Workspace[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateWorkspaceFormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      theme: "slate",
    },
  });

  const theme = watch("theme");

  const handleThemeChange = (value: string) => {
    setValue("theme", value);
  };

  const createWorkspace = useCallback(
    async (data: CreateWorkspaceFormData) => {
      setIsCreating(true);

      try {
        const response = await axios.post(`/api/notetaking`, data);

        console.log("Workspace Created Response:", response.data);

        const workspaceCreated = response.data;

        if (workspaceCreated) {
          setPreviousWorkspaces((prev) => [...prev, workspaceCreated]);
          toast.success("Workspace Created");
          router.push(`/tools/notes/dashboard/${workspaceCreated}`);
        } else {
          toast.error("Failed to create workspace. Please try again.");
        }
      } catch (error) {
        console.error("Error creating workspace:", error);
        toast.error("Failed to create workspace. Please try again.");
      } finally {
        setIsCreating(false);
        reset();
      }
    },
    [router, reset],
  );

  const onSubmit: SubmitHandler<CreateWorkspaceFormData> = (data) => {
    createWorkspace(data);
  };

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again.</div>}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-center text-3xl font-bold">
            Create Your Workspace
          </h1>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  New Workspace
                </CardTitle>
                <CardDescription>
                  Set up your new workspace with a name, description, and theme.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspaceName">Workspace Name</Label>
                    <Input
                      id="workspaceName"
                      placeholder="Enter workspace name"
                      {...register("title", {
                        required: "Workspace name is required",
                      })}
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
                      placeholder="Describe your workspace"
                      {...register("description")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Color Theme</Label>
                    <Select
                      defaultValue="slate"
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorThemes.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            {theme.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workspace
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Previous Workspaces
                </CardTitle>
                <CardDescription>
                  Quick access to your recently created workspaces.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {previousWorkspaces.length > 0 ? (
                    <ul className="space-y-4">
                      {previousWorkspaces.map((workspace) => (
                        <li
                          key={workspace._id || uuidv4()}
                          className="flex items-center space-x-4"
                        >
                          <Avatar>
                            <AvatarImage
                              src={undefined}
                              alt={workspace.title || "Workspace"}
                            />
                            <AvatarFallback>
                              {workspace.title
                                ? workspace.title.slice(0, 2).toUpperCase()
                                : "WS"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {workspace.title || "Untitled Workspace"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Created on{" "}
                              {workspace.createdAt
                                ? new Date(
                                    workspace.createdAt,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto"
                            onClick={() =>
                              router.push(
                                `/tools/notes/dashboard/${workspace._id}`,
                              )
                            }
                          >
                            Open
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                      <Briefcase className="mb-4 h-12 w-12 opacity-50" />
                      <p>No workspaces created yet.</p>
                      <p className="mt-2 text-sm">
                        Create your first workspace to get started!
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
