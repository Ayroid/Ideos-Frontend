"use client";
import { useState } from "react";
import { MdMusicNote, MdOutlineWallpaper, MdTimelapse } from "react-icons/md";
import { TbPlugConnected } from "react-icons/tb";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { PomodoroTemplates } from "./pomodoroTemplate";
import PomodoroThemes from "./pomodoroTheme";

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
    // {
    //   id: 3,
    //   title: "Sounds",
    //   icon: <MdMusicNote size={20} />,
    // },
    // {
    //   id: 4,
    //   title: "Integrations",
    //   icon: <TbPlugConnected size={20} />,
    // },
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
                className={`m-1 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-all hover:bg-primary-foreground/95 ${
                  activePanel === page.title ? "bg-primary-foreground/95" : ""
                }`}
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
        <div className="w-[30rem] overflow-y-scroll p-4 pt-0">
          <CardHeader className="px-4 py-6">
            <CardTitle className="mx-2 text-2xl">{activePanel}</CardTitle>
            {activePanel === "Templates" && <PomodoroTemplates />}
            {activePanel === "Themes" && <PomodoroThemes />}
          </CardHeader>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroSettings;
