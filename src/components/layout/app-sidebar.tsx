// src/components/layout/app-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Cpu,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function AppSidebar() {
  const { logout } = useAuth();

  return (
    <>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <Link href="/dashboard" className="flex items-center gap-2">
            <Cpu className="h-8 w-8 text-primary" />
            <span className="font-bold font-headline text-lg uppercase tracking-widest group-data-[collapsible=icon]:hidden">
              Talxify
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarMenu className="flex-1">
        {/* All menu items have been removed as per the reset request */}
      </SidebarMenu>
      
      <SidebarFooter className="border-t mt-auto p-2 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" onClick={logout} variant="ghost" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground justify-start group-data-[collapsible=icon]:justify-center">
              <LogOut className="h-8 w-8" />
              <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
              <SidebarTrigger className="w-full justify-start group-data-[collapsible=icon]:justify-center" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </>
  );
}
