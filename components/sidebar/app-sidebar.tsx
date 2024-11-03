"use client";

import {
  AudioWaveform,
  Brush,
  Command,
  GalleryVerticalEnd,
  Hourglass,
  LayoutDashboard,
  LifeBuoy,
  PencilRuler,
  PieChart,
  Send,
  Settings,
  SquareKanban,
  SquarePen,
} from "lucide-react";
import * as React from "react";

import { SidebarSection } from "@/components/sidebar/sidebar-sections";
import { SidebarUser } from "@/components/sidebar/sidebar-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { SecondarySidebarSection } from "./sidebar-secondary";
import { SidebarMain } from "./sidebar-main";
import { Separator } from "../ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useKindeBrowserClient();

  const sidebarData = {
    user: {
      name: user?.given_name ?? "User",
      email: user?.email ?? "user@gmail.com",
      avatar: user?.picture ?? undefined,
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    pages: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: PieChart,
      },
      {
        title: "All Tools",
        url: "/tools",
        icon: PencilRuler,
      },
    ],
    tools: [
      {
        title: "Kanban",
        url: "/tools/kanban",
        icon: SquareKanban,
      },
      {
        title: "Pomodoro",
        url: "/tools/pomodoro",
        icon: Hourglass,
      },
      {
        title: "Notes",
        url: "/tools/notes",
        icon: SquarePen,
      },
      {
        title: "Drawing",
        url: "/tools/drawing",
        icon: Brush,
      },
    ],
    utilities: [
      {
        title: "Support",
        url: "/support",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "/feedback",
        icon: Send,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain sections={sidebarData.pages} groupLabel="Pages" />
        <Separator />
        <SidebarMain sections={sidebarData.tools} groupLabel="Tools" />
        <SecondarySidebarSection items={sidebarData.utilities} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
