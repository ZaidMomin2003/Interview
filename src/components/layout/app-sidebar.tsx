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
  Rocket,
  LogOut,
  Video,
  Target,
  History,
  GalleryVertical,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const menuItems = [
   {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
   {
    href: "/arena",
    label: "Arena",
    icon: Target,
  },
  {
    href: "/ai-interview",
    label: "AI Interview",
    icon: Video,
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
    href: "/calculate-salary",
    label: "Salary Calculator",
    icon: TrendingUp,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
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
  const { user, logout } = useAuth();
  const [activePillStyle, setActivePillStyle] = useState({});
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const activeItem = menuRef.current?.querySelector(`[data-active="true"]`) as HTMLElement;
    if (activeItem) {
      setActivePillStyle({
        height: activeItem.offsetHeight,
        top: activeItem.offsetTop,
      });
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="shrink-0 md:hidden" asChild>
             <SidebarTrigger/>
           </Button>
           <Link href="/dashboard" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg group-data-[collapsible=icon]:hidden">
              Talxify
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarMenu ref={menuRef} className="flex-1 relative">
        <motion.div
          className="absolute left-2 w-[calc(100%-1rem)] bg-primary/20 rounded-lg -z-10"
          animate={activePillStyle}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
              variant="ghost"
              className="justify-start"
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter className="border-t mt-auto p-2 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton tooltip="Profile" asChild isActive={pathname.startsWith('/profile')} variant="ghost" className="justify-start">
                <Link href="/profile">
                  <Avatar className="size-7">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                    <AvatarFallback className="text-xs font-bold">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user?.displayName || 'Your Profile'}</span>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" onClick={handleLogout} variant="ghost" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground justify-start">
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
