// src/components/layout/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, BarChart3, FileText, History, LayoutDashboard, LogOut, UserCircle, Rocket, Library, Notebook, AlarmClock, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { AppUser } from "@/hooks/use-user-data";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/use-user-data";
import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, differenceInMilliseconds } from 'date-fns';

const navLinks = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/interview-prep", icon: <Bot />, label: "AI Interview" },
    { href: "/coding-gym", icon: <CodeXml />, label: "Coding Gym" },
    { href: "/notes", icon: <Notebook />, label: "AI Notes" },
    { href: "/portfolio", icon: <UserCircle />, label: "Portfolio" },
    { href: "/reminders", icon: <AlarmClock />, label: "Reminders" },
];

function CodeXml(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m18 16 4-4-4-4"/>
      <path d="m6 8-4 4 4 4"/>
      <path d="m14.5 4-5 16"/>
    </svg>
  );
}

function FourSquaresIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M10.5 4.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm1.5 1.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm7.5-6h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm1.5 1.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Z" />
        </svg>
    )
}

function Countdown({ to, from }: { to: Date; from: Date }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDuration = differenceInMilliseconds(to, from);
  const remainingDuration = differenceInMilliseconds(to, now);
  const progress = totalDuration > 0 ? Math.max(0, (remainingDuration / totalDuration) * 100) : 0;
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const days = differenceInDays(to, now);
  const hours = differenceInHours(to, now) % 24;
  const minutes = differenceInMinutes(to, now) % 60;

  if (now > to) {
    return (
      <div className="text-center text-destructive-foreground">
        Time's up! Good luck!
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
                className="text-primary/10"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
            />
            <circle
                className="text-primary-foreground transition-all duration-1000 ease-linear"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
            />
        </svg>
        <div className="flex justify-around text-center w-full z-10 text-primary-foreground">
            <div><span className="font-bold text-xl">{days}</span><p className="text-xs opacity-70">days</p></div>
            <div><span className="font-bold text-xl">{hours}</span><p className="text-xs opacity-70">hrs</p></div>
            <div><span className="font-bold text-xl">{minutes}</span><p className="text-xs opacity-70">mins</p></div>
        </div>
    </div>
  );
}


export function AppSidebar({ user }: { user: AppUser | null }) {
  const { logout } = useAuth();
  const { profile } = useUserData();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path));

  // Find the next upcoming reminder
  const nextReminder = profile?.reminders?.length ? profile.reminders
    .filter(r => new Date(r.date) > new Date())
    .sort((a,b) => a.date - b.date)[0] : null;

  const reminderStartDate = nextReminder ? new Date() : new Date(); // In a real app, you might store when reminder was set

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <FourSquaresIcon className="h-8 w-8 text-primary" />
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

      <SidebarFooter className="gap-4">
        {nextReminder && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-orange-400 text-primary-foreground shadow-lg shadow-primary/30 space-y-2 group-data-[collapsible=icon]:hidden relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate">{nextReminder.title}</p>
                    <Rocket className="h-4 w-4 opacity-80" />
                </div>
                <div className="h-28 w-full">
                  <Countdown to={new Date(nextReminder.date)} from={reminderStartDate} />
                </div>
            </div>
        )}
         <Button asChild variant="default" className="w-full">
            <Link href="/pricing"><Rocket className="mr-2" /> Upgrade Plan</Link>
         </Button>
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
