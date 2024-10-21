"use client"

import React, { useState, useCallback } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, Briefcase, FileText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ErrorBoundary } from "react-error-boundary"
import axios from "axios"

interface CreateWorkspaceFormData {
  logo?: FileList
  title: string
  description: string
  theme: string
}

interface Workspace {
  id: string
  title: string
  logo: string | null
  createdAt: string
  description: string
  theme: string
}

const colorThemes = [
  { value: "slate", label: "Slate" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
]

export default function WorkspaceCreation() {
  const router = useRouter()
  const [previousWorkspaces, setPreviousWorkspaces] = useState<Workspace[]>([])
  const [isCreating, setIsCreating] = useState(false)

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
      logo: undefined,
      title: "",
      description: "",
      theme: "slate",
    },
  })

  // Watch the current theme value
  const theme = watch("theme")

  // Function to update theme value
  const handleThemeChange = (value: string) => {
    setValue("theme", value)
  }

  const createWorkspace = useCallback(async (data: CreateWorkspaceFormData) => {
    setIsCreating(true);
    const workspaceId = uuidv4();

    console.log("Form data:", data); // Debug form data

    try {
      const response = await axios.post(`/api/notetaking/${workspaceId}`, {
        title: data.title,
        description: data.description,
        theme: data.theme,
        logo: null, // Update with actual logo handling if necessary
      });

      console.log("Workspace Created Response:", response.data); // Debug backend response

      const workspaceCreated = response.data;

      if (workspaceCreated) {
        setPreviousWorkspaces((prev) => [...prev, workspaceCreated]);
        toast.success("Workspace Created");
        router.push(`/tools/notes/dashboard/${workspaceCreated._id}`);
      } else {
        toast.error("Failed to create workspace. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating workspace:", error.response?.data || error.message);
      } else {
        console.error("Error creating workspace:", error);
      }
      toast.error("Failed to create workspace. Please try again.");
    } finally {
      setIsCreating(false);
      reset();
    }
  }, [router, reset]);

  const onSubmit: SubmitHandler<CreateWorkspaceFormData> = (data) => {
    createWorkspace(data)
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Create Your Workspace</h1>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
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
                      {...register("title", { required: "Workspace name is required" })}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
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
                    <Select defaultValue="slate" onValueChange={handleThemeChange}>
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
                  <FileText className="w-5 h-5 mr-2" />
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
                        <li key={workspace.id} className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={workspace.logo || undefined} alt={workspace.title} />
                            <AvatarFallback>
                              {workspace.title.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">{workspace.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Created on {new Date(workspace.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto"
                            onClick={() => router.push(`/tools/notes/dashboard/${workspace.id}`)}
                          >
                            Open
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                      <Briefcase className="w-12 h-12 mb-4 opacity-50" />
                      <p>No workspaces created yet.</p>
                      <p className="text-sm mt-2">Create your first workspace to get started!</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
