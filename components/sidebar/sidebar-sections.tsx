import { ChevronRight, type LucideIcon } from "lucide-react";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SidebarSection({
  groupLabel,
  sections,
}: {
  groupLabel: string;
  sections: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      icon?: LucideIcon;
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {sections.map((item) =>
          item.items ? (
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="relative">
                <CollapsibleTrigger asChild className="absolute right-2 top-2">
                  <ChevronRight className="ml-auto rounded-sm bg-inherit transition-transform duration-200 hover:bg-gray-100/10 group-data-[state=open]/collapsible:rotate-90" size="16" />
                </CollapsibleTrigger>
                <a href={item.url} className="flex items-center gap-2">
                  <SidebarMenuButton tooltip={item.name}>
                    {item.icon && <item.icon size="16" />}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </a>
                <CollapsibleContent className="data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden transition-all duration-300">
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <a href={item.url}>
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton tooltip={item.name}>
                  {item.icon && <item.icon size="16" />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </a>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
