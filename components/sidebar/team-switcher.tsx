"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/store/workspace"
import { workspaceService } from "@/services/workspace"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Workspace } from "@/services/workspace"

interface TeamSwitcherProps {
  personal: Workspace[];
  shared: Workspace[];
  activeWorkspace: Workspace | null;
}

export function TeamSwitcher({ personal, shared, activeWorkspace }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { setActiveWorkspace } = useWorkspaceStore()

  const handleWorkspaceSelect = async (workspace: Workspace) => {
    try {
      const updatedWorkspace = await workspaceService.setActiveWorkspace(workspace._id);
      setActiveWorkspace(updatedWorkspace);
      router.push(`/workspaces/${workspace._id}`);
    } catch (error) {
      console.error("Error switching workspace:", error);
    }
  };

  // Default icon component for workspaces
  const WorkspaceIcon = React.useMemo(() => {
    return () => (
      <div className="flex items-center justify-center size-4">
        <div className="size-3 rounded-sm bg-sidebar-primary" />
      </div>
    );
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground py-[1.62rem]"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <WorkspaceIcon />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name ?? "Select Workspace"}
                </span>
                <span className="truncate text-xs">
                  {personal.some(w => w._id === activeWorkspace?._id) ? "Personal" : "Shared"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {personal.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Personal Workspaces
                </DropdownMenuLabel>
                {personal.map((workspace, index) => (
                  <DropdownMenuItem
                    key={workspace._id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <WorkspaceIcon />
                    </div>
                    {workspace.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      ⌘{index + 1}
                    </span>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {shared.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Shared Workspaces
                </DropdownMenuLabel>
                {shared.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace._id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <WorkspaceIcon />
                    </div>
                    {workspace.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push('/workspaces/new')}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">New Workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}