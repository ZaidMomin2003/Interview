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
  CodeXml,
  Cpu,
  FileText,
  LayoutDashboard,
  LogOut,
  Mic,
  DollarSign,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard />,
    },
    {
      href: "/resume-studio",
      label: "Resume Studio",
      icon: <FileText />,
    },
    {
      href: "/interview-prep",
      label: "AI Interview Prep",
      icon: <Mic />,
    },
    {
      href: "/coding-gym",
      label: "Coding Gym",
      icon: <CodeXml />,
    },
    {
      href: "/salary-calculator",
      label: "Salary Calculator",
      icon: <DollarSign />,
    },
    {
      href: "/pomodoro",
      label: "Pomodoro Timer",
      icon: <Timer />,
    },
  ];

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
              <Link href={item.href}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={pathname.startsWith(item.href)}
                  className="justify-start"
                >
                  {item.icon}
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
      
      <SidebarFooter className="border-t mt-auto p-2 space-y-2 relative">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" onClick={logout} variant="ghost" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground justify-start group-data-[collapsible=icon]:justify-center">
              <LogOut className="h-5 w-5" />
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
