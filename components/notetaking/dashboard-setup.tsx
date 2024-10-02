"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { v4 } from "uuid";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import EmojiPicker from "../notetaking/emoji-picker";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation"; 
import { useWorkspaceStore } from "../../store/notetaking/workspace";

interface CreateWorkspaceFormData {
  logo?: FileList;
  workspaceName: string;
}

const DashboardSetup: React.FC = () => {
  const { addWorkspace } = useWorkspaceStore((state) => ({
    addWorkspace: state.addWorkspace,
  }));
  const [selectedEmoji, setSelectedEmoji] = useState("💼");
  const router = useRouter(); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<CreateWorkspaceFormData>({
    mode: "onChange",
    defaultValues: {
      logo: undefined,
      workspaceName: "",
    },
  });

  const onSubmit: SubmitHandler<CreateWorkspaceFormData> = async (value) => {
    const file = value.logo?.[0];
    let filePath = null;
    const workspaceUUID = v4();

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "default-preset");
        formData.append("public_id", workspaceUUID);

        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/dkp2xdsdu/image/upload`, 
          formData
        );

        filePath = uploadResponse.data.secure_url;
      } catch (error) {
        console.error("Error uploading workspace logo:", error);
        toast.error("Error! Could not upload your workspace logo");
      }
    }

    try {
      const newWorkspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: selectedEmoji,
        id: workspaceUUID,
        inTrash: false,
        title: value.workspaceName,
        workspaceOwner: "user-id",
        logo: filePath || null,
        bannerUrl: "",
        folders: [],
      };

      const response = await axios.post(
        `/api/notetaking`, 
        newWorkspace,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to create workspace");
      }

      addWorkspace(newWorkspace);

      toast.success("Workspace Created");
      router.replace(`/tools/notes/dashboard/${newWorkspace.id}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error(
        "Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later."
      );
    } finally {
      reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Let's create a private workspace to get you started. You can add collaborators later from the workspace settings tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="workspaceName"
                  className="text-sm text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div>
              <Label htmlFor="logo" className="text-sm text-muted-foreground">
                Workspace Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Logo"
                disabled={isLoading}
                {...register("logo")}
              />
              <small className="text-red-600">
                {errors?.logo?.message?.toString()}
              </small>
            </div>
            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {!isLoading ? "Create Workspace" : "Loading..."}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSetup;
