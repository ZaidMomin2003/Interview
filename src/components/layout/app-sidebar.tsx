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
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

const navLinks = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/interview-prep", icon: <Bot />, label: "AI Interview" },
    { href: "/coding-gym", icon: <CodeXml />, label: "Code & AI Feedback" },
    { href: "/notes", icon: <Notebook />, label: "AI Notes" },
    { href: "/resume-studio", icon: <FileText />, label: "Resume Studio" },
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

function Countdown({ to }: { to: Date }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const days = differenceInDays(to, now);
    const hours = differenceInHours(to, now) % 24;
    const minutes = differenceInMinutes(to, now) % 60;
    const seconds = differenceInSeconds(to, now) % 60;
    
    if (now > to) {
        return <span className="text-destructive">Time's up!</span>;
    }

    return (
        <div className="flex justify-around text-center w-full">
            <div><span className="font-bold text-lg">{days}</span><p className="text-xs text-muted-foreground">days</p></div>
            <div><span className="font-bold text-lg">{hours}</span><p className="text-xs text-muted-foreground">hrs</p></div>
            <div><span className="font-bold text-lg">{minutes}</span><p className="text-xs text-muted-foreground">mins</p></div>
            <div><span className="font-bold text-lg">{seconds}</span><p className="text-xs text-muted-foreground">secs</p></div>
        </div>
    );
}

export function AppSidebar({ user }: { user: AppUser | null }) {
  const { logout } = useAuth();
  const { profile } = useUserData();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path));

  const nextReminder = profile?.reminders?.length ? profile.reminders.reduce((prev, curr) => {
      return new Date(curr.date) > new Date() && new Date(curr.date) < new Date(prev.date) ? curr : prev;
  }) : null;

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
            <div className="p-3 rounded-lg bg-secondary space-y-2 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold truncate">{nextReminder.title}</p>
                <Countdown to={new Date(nextReminder.date)} />
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