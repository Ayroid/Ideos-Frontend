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
import { useWorkspaceStore } from "@/store/workspace";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  ArrowRight,
  Bell,
  Bot,
  Brush,
  Check,
  Clock,
  FileText,
  Hourglass,
  PieChart,
  Search,
  Settings,
  SquareKanban,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Dashboard = () => {
  const { user } = useKindeBrowserClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { activeWorkspace } = useWorkspaceStore();

  const pagesData = React.useMemo(
    () => [
      {
        id: 1,
        title: "Kanban",
        icon: <SquareKanban className="h-12 w-12" />,
        link: `/workspaces/${activeWorkspace?._id}/kanban`,
        status: true,
        description: "Visual task and project management",
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
        icon: <Hourglass className="h-12 w-12" />,
        link: `/workspaces/${activeWorkspace?._id}/pomodoro`,
        status: true,
        description: "Focus timer with work-break cycles",
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
        icon: <SquarePen className="h-12 w-12" />,
        link: `/workspaces/${activeWorkspace?._id}/notetaking`,
        status: true,
        description: "Simple and quick note-taking",
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
        icon: <Brush className="h-12 w-12" />,
        link: `/workspaces/${activeWorkspace?._id}/drawing`,
        status: true,
        description: "Digital canvas for sketching",
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
        link: `/workspaces/${activeWorkspace?._id}/summariser`,
        status: false,
        description: "AI-powered note condensing",
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
        link: `/workspaces/${activeWorkspace?._id}/ai-assistant`,
        status: false,
        description: "Smart help across all tools",
        features: [
          "24/7 assistance",
          "Context-aware help",
          "Task automation",
          "Learning capabilities",
        ],
      },
    ],
    [activeWorkspace?._id],
  );

  const quickActions = React.useMemo(
    () => [
      {
        id: "analytics",
        title: "Analytics",
        icon: <PieChart className="h-5 w-5" />,
        path: `/workspaces/${activeWorkspace?._id}/analytics`,
      },
      {
        id: "notifications",
        title: "Notifications",
        icon: <Bell className="h-5 w-5" />,
        path: `/workspaces/${activeWorkspace?._id}/notifications`,
      },
      {
        id: "settings",
        title: "Settings",
        icon: <Settings className="h-5 w-5" />,
        path: `/workspaces/${activeWorkspace?._id}/settings`,
      },
    ],
    [activeWorkspace?._id],
  );

  const filteredTools = pagesData.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <ScrollArea>
      <div className="space-y-8 p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.given_name ?? "User"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-[300px] rounded-lg border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {quickActions.map((action) => (
              <Link key={action.id} href={action.path}>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  title={action.title}
                >
                  {action.icon}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative sm:hidden">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-lg border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((page) => (
            <Card
              key={page.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                !page.status ? "opacity-75" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-2">
                      {page.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">{page.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-1.5">
                        {page.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {page.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="shrink-0 rounded-full bg-primary/10 p-1">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  size="lg"
                  className={`w-full transition-all duration-300 ${
                    page.status
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-muted text-muted-foreground"
                  }`}
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

export default Dashboard;
