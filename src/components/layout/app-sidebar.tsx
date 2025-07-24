// src/components/layout/app-sidebar.tsx
"use client";

import { useState } from "react";
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
  LayoutDashboard,
  FileText,
  LogOut,
  GalleryVertical,
  Cpu,
  Rocket,
  CodeXml,
  Video,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
   {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/ai-interview/start",
    label: "AI Interview",
    icon: Video,
  },
  {
    href: "/coding-practice",
    label: "Code & AI Feedback",
    icon: CodeXml,
  },
  {
    href: "/notes",
    label: "AI Notes",
    icon: BookOpen,
  },
  {
    href: "/resume-builder",
    label: "Resume Studio",
    icon: FileText,
  },
  {
    href: "/portfolio-builder",
    label: "Portfolio",
    icon: GalleryVertical,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
              className="justify-start group-data-[collapsible=icon]:justify-center"
            >
              <Link href={item.href}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarFooter className="border-t mt-auto p-2 space-y-2">
         <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/pricing')}
              tooltip="Upgrade"
              variant="default"
              className="justify-start group-data-[collapsible=icon]:justify-center bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/pricing">
                <Rocket />
                <span className="group-data-[collapsible=icon]:hidden">Upgrade Plan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" onClick={handleLogout} variant="ghost" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground justify-start group-data-[collapsible=icon]:justify-center">
              <LogOut />
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
