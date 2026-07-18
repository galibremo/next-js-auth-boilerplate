"use client";

import * as React from "react";

import { NavMain } from "@/components/layout/nav-main";
import { NavProjects } from "@/components/layout/nav-projects";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppSwitcher } from "./app-switcher";
import { NavMenu } from "./nav-menu";
import { navPlatformItem, userItems } from "./menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <AppSwitcher />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMenu label="Platform" items={navPlatformItem} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser items={userItems} />
      </SidebarFooter>
    </Sidebar>
  );
}
