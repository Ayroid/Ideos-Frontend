"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AiFillHourglass } from "react-icons/ai";
import { BsKanbanFill } from "react-icons/bs";
import { FaCheck, FaRobot } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { MdDraw, MdSummarize } from "react-icons/md";

const pagesData = [
  {
    id: 1,
    title: "Kanban",
    icon: <BsKanbanFill size={64} />,
    status: true,
    link: "/tools/kanban",
    description: "Organize your tasks and projects visually",
  },
  {
    id: 2,
    title: "Pomodoro",
    icon: <AiFillHourglass size={64} />,
    status: true,
    link: "/tools/pomodoro",
    description: "Boost productivity with timed work sessions",
  },
  {
    id: 3,
    title: "Notes",
    icon: <FaNoteSticky size={64} />,
    status: true,
    link: "/tools/notes",
    description: "Capture and organize your thoughts quickly",
  },
  {
    id: 4,
    title: "Drawing",
    icon: <MdDraw size={64} />,
    status: true,
    link: "/tools/drawing",
    description: "Sketch ideas and create visual content",
  },
  {
    id: 5,
    title: "Note Summariser",
    icon: <MdSummarize size={64} />,
    status: false,
    link: "/tools/summariser",
    description: "Automatically generate concise note summaries",
  },
  {
    id: 6,
    title: "Idoe AI Assistant",
    icon: <FaRobot size={64} />,
    status: false,
    link: "/tools/ai-assistant",
    description: "Get intelligent assistance throughout the application",
  },
];

const ToolsPage = () => {
  return (
    <div className="p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Productivity Tools</h1>
        <p className="text-xl text-muted-foreground">
          Enhance your workflow with our suite of powerful tools designed to boost your productivity.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagesData.map((page) => (
          <Link key={page.id} href={page.link} className="block">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader className="relative">
                <div className="absolute top-4 right-4">
                  {page.status ? (
                    <Badge variant="default" className="bg-green-500">
                      <FaCheck className="mr-1" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Coming Soon</Badge>
                  )}
                </div>
                <div className="flex justify-center items-center h-24 w-24 rounded-full bg-primary-foreground mx-auto mb-4">
                  {page.icon}
                </div>
                <CardTitle className="text-center text-2xl">{page.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  {page.description}
                </CardDescription>
                <Button className="w-full" disabled={!page.status}>
                  {page.status ? "Launch Tool" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <footer className="mt-16 text-center">
        <p className="text-muted-foreground">
          Our tools are designed to work seamlessly together, helping you achieve more in less time.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Have a suggestion for a new tool? <a href="#" className="underline">Let us know!</a>
        </p>
      </footer>
    </div>
  );
};

export default ToolsPage;