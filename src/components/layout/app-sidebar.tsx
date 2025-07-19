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
  LayoutDashboard,
  FileText,
  CodeXml,
  User,
  Rocket,
  Settings,
  LogOut,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const menuItems = [
  {
    href: "/ai-interview",
    label: "AI Interview",
    icon: Video,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/resume-builder",
    label: "Resume Studio",
    icon: FileText,
  },
  {
    href: "/coding-practice",
    label: "Coding Gym",
    icon: CodeXml,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" asChild>
             <SidebarTrigger/>
           </Button>
           <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-accent" />
            <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden">
              DevPro Ascent
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter className="border-t mt-auto p-2">
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Log Out" className="bg-transparent hover:bg-destructive/80 text-red-500 hover:text-white border border-red-500/50 hover:border-red-500 transition-colors duration-300">
            <LogOut />
            <span>Log Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}