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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Target,
  History,
  GalleryVertical,
  Cpu,
  Bookmark,
  Tags,
  Rocket,
  CodeXml,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { Progress } from "../ui/progress";

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
    href: "/resume-builder",
    label: "Resume Studio",
    icon: FileText,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
   {
    href: "/bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
  },
  {
    href: "/portfolio-builder",
    label: "Portfolio",
    icon: GalleryVertical,
  },
];

// Placeholder data for credits
const creditUsage = {
    interviews: { used: 3, total: 10 },
    codingQuestions: { used: 25, total: 60 },
    notes: { used: 12, total: 30 },
};

const CreditUsageCard = () => {
    const interviewProgress = (creditUsage.interviews.used / creditUsage.interviews.total) * 100;
    const questionsProgress = (creditUsage.codingQuestions.used / creditUsage.codingQuestions.total) * 100;
    const notesProgress = (creditUsage.notes.used / creditUsage.notes.total) * 100;

    return (
        <div className="px-4 group-data-[collapsible=icon]:hidden">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-3 text-sm">
                <h4 className="font-semibold text-foreground">Credit Usage</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-grow">
                             <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Interviews</span>
                                <span>{creditUsage.interviews.used} / {creditUsage.interviews.total}</span>
                            </div>
                            <Progress value={interviewProgress} className="h-1.5"/>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <CodeXml className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-grow">
                             <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Coding Questions</span>
                                <span>{creditUsage.codingQuestions.used} / {creditUsage.codingQuestions.total}</span>
                            </div>
                            <Progress value={questionsProgress} className="h-1.5"/>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-grow">
                             <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Notes</span>
                                <span>{creditUsage.notes.used} / {creditUsage.notes.total}</span>
                            </div>
                            <Progress value={notesProgress} className="h-1.5"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

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
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <div className="flex-grow" />

      <CreditUsageCard />

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
                <span>Upgrade Plan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <Link href="/profile" className="flex-grow overflow-hidden group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                <Avatar className="size-9">
                  {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                  <AvatarFallback className="text-sm font-bold bg-primary/20 text-primary">
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-sm truncate text-foreground">{user?.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </Link>
            <ThemeToggle />
        </div>
        
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuButton tooltip="Log Out" onClick={handleLogout} variant="ghost" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground justify-start group-data-[collapsible=icon]:justify-center">
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Collapsed view footer */}
          <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
             <SidebarMenuButton tooltip="Profile" asChild isActive={pathname.startsWith('/profile')} variant="ghost" className="justify-start group-data-[collapsible=icon]:justify-center">
                <Link href="/profile">
                  <Avatar className="size-7">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                    <AvatarFallback className="text-xs font-bold">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">{user?.displayName || 'Your Profile'}</span>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
            <SidebarMenuButton tooltip="Log Out" onClick={handleLogout} variant="ghost" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground justify-start group-data-[collapsible=icon]:justify-center">
              <LogOut />
              <span className="sr-only">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
