// src/components/layout/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, BarChart3, FileText, History, LayoutDashboard, LogOut, UserCircle, Rocket, Library, Notebook, AlarmClock, Trash2, CodeXml, ClipboardList, User, CreditCard, LifeBuoy } from "lucide-react";
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
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/interview-prep", icon: <Bot />, label: "AI Interview" },
    { href: "/coding-gym", icon: <CodeXml />, label: "Coding Gym" },
    { href: "/notes", icon: <Notebook />, label: "AI Notes" },
    { href: "/track", icon: <ClipboardList />, label: "Track" },
    { href: "/reminders", icon: <AlarmClock />, label: "Reminders" },
    { href: "/portfolio", icon: <UserCircle />, label: "Portfolio" },
];


function FourSquaresIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M10.5 4.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm1.5 1.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm7.5-6h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm1.5 1.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Z" />
        </svg>
    )
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-2xl font-bold font-mono tracking-widest">{String(value).padStart(2, '0')}</span>
        <span className="text-xs opacity-70 uppercase">{label}</span>
    </div>
);

function Countdown({ to }: { to: Date }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = differenceInDays(to, now);
  const hours = differenceInHours(to, now) % 24;
  const minutes = differenceInMinutes(to, now) % 60;
  const seconds = differenceInSeconds(to, now) % 60;

  if (now > to) {
    return (
      <div className="text-center text-primary-foreground font-semibold">
        Time's up! Good luck!
      </div>
    );
  }

  return (
    <div className="flex justify-around items-center h-full w-full text-primary-foreground">
        <TimeUnit value={days} label="Days" />
        <TimeUnit value={hours} label="Hours" />
        <TimeUnit value={minutes} label="Mins" />
        <TimeUnit value={seconds} label="Secs" />
    </div>
  );
}


export function AppSidebar({ user }: { user: AppUser | null }) {
  const { logout } = useAuth();
  const { profile, removeReminder } = useUserData();
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path));

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Find the next upcoming reminder
  const nextReminder = profile?.reminders?.length ? profile.reminders
    .filter(r => new Date(r.date) > new Date())
    .sort((a,b) => a.date - b.date)[0] : null;

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
            <div className="p-3 rounded-lg bg-primary text-primary-foreground space-y-2 group-data-[collapsible=icon]:hidden relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                    onClick={() => removeReminder(nextReminder.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-between pr-6">
                    <p className="text-sm font-semibold truncate">{nextReminder.title}</p>
                    <Rocket className="h-4 w-4 opacity-80 flex-shrink-0" />
                </div>
                <div className="h-16 w-full">
                  <Countdown to={new Date(nextReminder.date)} />
                </div>
            </div>
        )}
         <Button asChild variant="default" className="w-full">
            <Link href="/pricing"><Rocket className="mr-2" /> Upgrade Plan</Link>
         </Button>
        <SidebarMenu>
          <SidebarSeparator className="my-1" />
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full p-2 rounded-md text-left hover:bg-sidebar-accent transition-colors duration-200">
                     <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage
                        src={profile?.photoURL || ""}
                        alt={profile?.displayName || "User"}
                      />
                      <AvatarFallback>
                        {profile?.displayName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-semibold truncate text-foreground">{profile?.displayName}</p>
                        <p className="text-xs truncate text-muted-foreground">{profile?.email}</p>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start" forceMount>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/portfolio')}><User className="mr-2 h-4 w-4"/>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/pricing')}><CreditCard className="mr-2 h-4 w-4"/>Billing</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/support')}><LifeBuoy className="mr-2 h-4 w-4"/>Support</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Log out</DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                        <span>Theme</span>
                        <ThemeToggle />
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
