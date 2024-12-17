"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Bot,
  Check,
  Clock,
  FileText,
  Layout,
  Pencil,
  StickyNote,
  Timer
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const pagesData = [
  {
    id: 1,
    title: "Kanban",
    icon: <Layout className="h-12 w-12" />,
    link: "/tools/kanban",
    status: true,
    description: "Organize your tasks and projects visually",
    features: [
      "Drag and drop tasks",
      "Multiple board views",
      "Task priorities",
      "Due dates",
    ],
  },
  {
    id: 2,
    title: "Pomodoro",
    icon: <Timer className="h-12 w-12" />,
    link: "/tools/pomodoro",
    status: true,
    description: "Boost productivity with timed work sessions",
    features: [
      "Customizable intervals",
      "Break reminders",
      "Session statistics",
      "Sound alerts",
    ],
  },
  {
    id: 3,
    title: "Notes",
    icon: <StickyNote className="h-12 w-12" />,
    link: "/tools/notes",
    status: true,
    description: "Capture and organize your thoughts quickly",
    features: [
      "Rich text editor",
      "Categories",
      "Search functionality",
      "Export options",
    ],
  },
  {
    id: 4,
    title: "Drawing",
    icon: <Pencil className="h-12 w-12" />,
    link: "/tools/drawing",
    status: true,
    description: "Sketch ideas and create visual content",
    features: [
      "Multiple brush types",
      "Layer support",
      "Export to PNG/SVG",
      "Collaborative mode",
    ],
  },
  {
    id: 5,
    title: "Note Summariser",
    icon: <FileText className="h-12 w-12" />,
    link: "/tools/summariser",
    status: false,
    description: "Automatically generate concise note summaries",
    features: [
      "AI-powered summaries",
      "Multiple formats",
      "Key points extraction",
      "Custom length",
    ],
  },
  {
    id: 6,
    title: "Idoe AI Assistant",
    icon: <Bot className="h-12 w-12" />,
    link: "/tools/ai-assistant",
    status: false,
    description: "Get intelligent assistance throughout the application",
    features: [
      "24/7 assistance",
      "Context-aware help",
      "Task automation",
      "Learning capabilities",
    ],
  },
];

const ToolCardSkeleton = () => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex pb-4">
      <div className="mb-4 flex items-start gap-4">
        <Skeleton className="h-[4.5rem] w-[4.5rem] rounded-xl" />{" "}
        {/* For icon container */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" /> {/* For title */}
          <Skeleton className="h-4 w-48" /> {/* For description */}
        </div>
      </div>
    </CardHeader>
    <CardContent className="pb-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="mr-2 h-4 w-4" /> {/* For checkmark */}
              <Skeleton className="h-4 w-24" /> {/* For feature text */}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" /> {/* For button */}
    </CardFooter>
  </Card>
);

const ToolsPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ScrollArea>
        <div className="p-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-64" /> {/* For page title */}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Productivity Tools
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pagesData.map((page) => (
            <Card key={page.id} className="relative overflow-hidden">
              <CardHeader className="flex pb-4">
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    {page.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-end gap-2">
                      <CardTitle className="text-3xl">{page.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {page.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {page.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!page.status}
                  asChild={page.status}
                >
                  {page.status ? (
                    <Link
                      href={page.link}
                      className="flex items-center justify-center"
                    >
                      Launch Tool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="flex items-center justify-center">
                      Coming Soon
                      <Clock className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ToolsPage;
