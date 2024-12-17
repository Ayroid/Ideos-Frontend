// CreateWorkspace.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WorkspaceLogoUpload } from "@/components/workspace/WorkspaceLogoUpload";

interface WorkspaceFormData {
  name: string;
  logo?: File;
}

const WORKSPACE_FEATURES = [
  {
    icon: "🎯",
    title: "Unified Platform",
    description: "Kanban, Pomodoro, and Notes all in one place",
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    description: "Powered by multi-agent conversation framework",
  },
  {
    icon: "📝",
    title: "Smart Notes",
    description: "AI-powered summaries and intelligent tagging system",
  },
  {
    icon: "⏱️",
    title: "Focus Timer",
    description: "Customizable Pomodoro timer for enhanced productivity",
  },
  {
    icon: "🎨",
    title: "Visual Management",
    description: "Intuitive Kanban boards with drag-and-drop functionality",
  },
  {
    icon: "🔄",
    title: "Real-time Sync",
    description: "Seamless collaboration and data synchronization",
  },
];

export default function CreateWorkspace() {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: "",
  });

  const handleSubmit = async () => {
    console.log("Form data:", formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto flex max-w-7xl justify-between gap-8 px-4 py-8">
        <div className="w-7/12 space-y-6">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Create new workspace</h1>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">
              Workspace Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter workspace name"
              className="h-12 text-lg"
            />
          </div>

          <WorkspaceLogoUpload
            label="Workspace Logo"
            onLogoChange={(file) =>
              setFormData((prev) => ({ ...prev, logo: file }))
            }
          />

          <Button
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className="w-full text-lg"
            size="lg"
          >
            Create Workspace
          </Button>
        </div>

        <div className="w-5/12 space-y-6 px-4 py-8">
          <h2 className="text-2xl font-semibold">Ideos Features</h2>
          <Card className="grid p-2">
            {WORKSPACE_FEATURES.map((feature, index) => (
              <div key={index}>
                <div className="flex gap-3 rounded-lg p-4 transition-colors hover:bg-accent/50">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {index < WORKSPACE_FEATURES.length - 1 && (
                  <Separator className="mx-2 my-2" />
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </main>
  );
}
