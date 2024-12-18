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
  Bell
} from "lucide-react";
import * as React from "react";
import { useParams } from 'next/navigation';
import { cn } from "@/lib/utils";

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

const CircularLoader = React.memo(({ className }: { className?: string }) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
});
CircularLoader.displayName = 'CircularLoader';

function AppSidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useKindeBrowserClient();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  const sidebarData = React.useMemo(() => ({
    user: {
      name: user?.given_name ?? "User",
      email: user?.email ?? "user@gmail.com",
      avatar: user?.picture ?? undefined,
    },
    teams: [
      {
        name: "Ideos",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Visual Rift",
        logo: Command,
        plan: "Enterprise",
      },
    ],
    pages: [
      {
        title: "Dashboard",
        url: `/workspace/${workspaceId}`,
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: `/workspace/${workspaceId}/analytics`,
        icon: PieChart,
      },
      {
        title: "Notifications",
        url: `/workspace/${workspaceId}/notifications`,
        icon: Bell,
      },
      {
        title: "Settings",
        url: `/workspace/${workspaceId}/settings`,
        icon: Settings,
      },
    ],
    tools: [
      {
        title: "Drawing",
        url: `/workspace/${workspaceId}/tools/drawing`,
        icon: Brush,
      },
      {
        title: "Kanban",
        url: `/workspace/${workspaceId}/tools/kanban`,
        icon: SquareKanban,
      },
      {
        title: "Notes",
        url: `/workspace/${workspaceId}/notetaking`,
        icon: SquarePen,
        subItems: [
          {
            title: "All Notebooks",
            url: `/workspace/${workspaceId}/notetaking`,
          }
        ]
      },
      {
        title: "Pomodoro",
        url: `/workspace/${workspaceId}/tools/pomodoro`,
        icon: Hourglass,
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
    ],
  }), [workspaceId, user?.given_name, user?.email, user?.picture]); // Only recompute when these values change

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <Separator />
        <SidebarMain sections={sidebarData.pages} groupLabel="Pages" />
        <Separator />
        <SidebarMain sections={sidebarData.tools} groupLabel="Tools" />
        <SecondarySidebarSection items={sidebarData.utilities} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
AppSidebarComponent.displayName = 'AppSidebarComponent';

export const AppSidebar = React.memo(AppSidebarComponent);