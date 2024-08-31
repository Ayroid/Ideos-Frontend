"use client";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdMusicNote, MdOutlineWallpaper, MdTimelapse } from "react-icons/md";
import { TbPlugConnected } from "react-icons/tb";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const PomodoroTemplates = () => {
  const templates = [
    {
      name: "Pomodoro 1",
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
    },
    {
      name: "Pomodoro 2",
      pomodoro: 30,
      shortBreak: 5,
      longBreak: 15,
    },
    {
      name: "Pomodoro 3",
      pomodoro: 20,
      shortBreak: 5,
      longBreak: 15,
    },
    {
      name: "Pomodoro 4",
      pomodoro: 25,
      shortBreak: 10,
      longBreak: 20,
    },
    {
      name: "Pomodoro 5",
      pomodoro: 30,
      shortBreak: 10,
      longBreak: 20,
    },
  ];

  return (
    <div className="flex flex-col gap-4 pt-4">
      {templates.map((template, index) => (
        <div
          key={index}
          className="relative flex h-full flex-col gap-2 rounded-md bg-primary-foreground p-4"
        >
          <h2 className="text-xl font-semibold">{template.name}</h2>
          <div className="flex text-sm text-primary/50">
            {template.pomodoro} | {template.shortBreak} | {template.longBreak}
          </div>
          <div className="absolute right-4 top-4 mt-1 flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <BsThreeDotsVertical className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-24">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};

const PomodoroSettings = () => {
  const sidebar = [
    {
      id: 1,
      title: "Templates",
      icon: <MdTimelapse size={20} />,
    },
    {
      id: 2,
      title: "Themes",
      icon: <MdOutlineWallpaper size={20} />,
    },
    {
      id: 3,
      title: "Sounds",
      icon: <MdMusicNote size={20} />,
    },
    {
      id: 4,
      title: "Integrations",
      icon: <TbPlugConnected size={20} />,
    },
  ];

  const [activePanel, setActivePanel] = useState("Templates");

  return (
    <Card>
      <CardContent className="m-0 flex h-[30rem] overflow-hidden rounded-xl p-0">
        <div className="h-full w-48 bg-black">
          <ScrollArea className="px-2 py-4">
            {sidebar.map((page) => (
              <div
                key={page.id}
                className={`m-1 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-all hover:bg-primary-foreground/95 ${activePanel === page.title ? "bg-primary-foreground/95" : ""}`}
                onClick={() => {
                  setActivePanel(page.title);
                }}
              >
                {page.icon}
                <h2>{page.title}</h2>
              </div>
            ))}
          </ScrollArea>
        </div>
        <Separator orientation="vertical" />
        <div className="w-[30rem] overflow-y-auto px-4">
          <CardHeader className="px-4 py-6">
            <CardTitle className="mx-2 text-2xl">{activePanel}</CardTitle>
            {activePanel === "Templates" && <PomodoroTemplates />}
          </CardHeader>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroSettings;
