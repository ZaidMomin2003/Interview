// src/components/layout/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, BarChart3, FileText, History, Cpu, LayoutDashboard, LogOut, Timer, UserCircle, Bookmark, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { AppUser } from "@/hooks/use-user-data";
import { useUserData } from "@/hooks/use-user-data";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function PomodoroTimer() {
    const { pomodoroState, profile, loading } = useUserData();

    if (loading || !pomodoroState.isActive) {
        return null;
    }

    const { timeLeft, mode } = pomodoroState;
    const settings = profile?.pomodoroSettings || { pomodoro: 25, shortBreak: 5, longBreak: 15 };
    const totalDuration = settings[mode] * 60;
    const progress = (timeLeft / totalDuration) * 100;
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const modeDisplay = {
      pomodoro: "Focusing",
      shortBreak: "Short Break",
      longBreak: "Long Break"
    }

    return (
        <Card className="bg-secondary/50 border-border/50">
          <CardContent className="p-3">
             <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold">{modeDisplay[mode]}</p>
                <p className="text-sm font-mono">{formatTime(timeLeft)}</p>
             </div>
             <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
    )
}

const navLinks = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/interview-prep", icon: <Bot />, label: "AI Interview" },
    { href: "/resume-studio", icon: <FileText />, label: "Resume Studio" },
    { href: "/coding-gym", icon: <BarChart3 />, label: "Coding Gym" },
    { href: "/portfolio", icon: <UserCircle />, label: "Portfolio" },
    { href: "/bookmarks", icon: <Bookmark />, label: "Bookmarks" },
    { href: "/history", icon: <History />, label: "History" },
    { href: "/pomodoro", icon: <Timer />, label: "Pomodoro" },
    { href: "/pricing", icon: <Star />, label: "Pricing" },
];

export function AppSidebar({ user }: { user: AppUser | null }) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path));

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Cpu className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-widest text-foreground uppercase">
            Talxify
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
            {navLinks.map(link => (
                <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton asChild isActive={isActive(link.href)}>
                    <Link href={link.href}>
                        {link.icon}
                        {link.label}
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <PomodoroTimer />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              Log Out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
