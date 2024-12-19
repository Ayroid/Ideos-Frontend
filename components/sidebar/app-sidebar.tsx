"use client";

import {
  Brush,
  Command,
  GalleryVerticalEnd,
  Hourglass,
  LayoutDashboard,
  LifeBuoy,
  PieChart,
  Send,
  Settings,
  SquareKanban,
  SquarePen,
  Bell,
} from "lucide-react";
import * as React from "react";
import { useParams } from "next/navigation";
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
import { useWorkspaceStore } from "@/store/workspace";

const CircularLoader = React.memo(({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  );
});
CircularLoader.displayName = "CircularLoader";

function AppSidebarComponent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useKindeBrowserClient();
  const { activeWorkspace, workspaces } = useWorkspaceStore();

  const sidebarData = React.useMemo(
    () => ({
      user: {
        name: user?.given_name ?? "User",
        email: user?.email ?? "user@gmail.com",
        avatar: user?.picture ?? undefined,
      },
      pages: [
        {
          title: "Dashboard",
          url: `/workspaces/${activeWorkspace?._id}`,
          icon: LayoutDashboard,
        },
        {
          title: "Analytics",
          url: `/workspaces/${activeWorkspace?._id}/analytics`,
          icon: PieChart,
        },
        {
          title: "Notifications",
          url: `/workspaces/${activeWorkspace?._id}/notifications`,
          icon: Bell,
        },
        {
          title: "Settings",
          url: `/workspaces/${activeWorkspace?._id}/settings`,
          icon: Settings,
        },
      ],
      tools: [
        {
          title: "Drawing",
          url: `/workspaces/${activeWorkspace?._id}/drawing`,
          icon: Brush,
        },
        {
          title: "Kanban",
          url: `/workspaces/${activeWorkspace?._id}/kanban`,
          icon: SquareKanban,
        },
        {
          title: "Notes",
          url: `/workspaces/${activeWorkspace?._id}/notetaking`,
          icon: SquarePen,
          subItems: [
            {
              title: "All Notebooks",
              url: `/workspaces/${activeWorkspace?._id}/notetaking`,
            },
          ],
        },
        {
          title: "Pomodoro",
          url: `/workspaces/${activeWorkspace?._id}/pomodoro`,
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
    }),
    [activeWorkspace?._id, user?.given_name, user?.email, user?.picture],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          personal={workspaces.personal}
          shared={workspaces.shared}
          activeWorkspace={activeWorkspace}
        />
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
AppSidebarComponent.displayName = "AppSidebarComponent";

export const AppSidebar = React.memo(AppSidebarComponent);
