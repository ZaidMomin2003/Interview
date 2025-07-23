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
  Target,
  GalleryVertical,
  Cpu,
  Tags,
  Rocket,
  CodeXml,
  Video,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
    id: "ai-interview",
    label: "AI Interview",
    icon: Video,
  },
  {
    href: "/coding-practice",
    label: "Coding Gym",
    icon: CodeXml,
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

const interviewSetupSchema = z.object({
  topic: z.string().min(1, "Please select a topic."),
  difficulty: z.string().min(1, "Please select a difficulty level."),
});


function InterviewSetupForm({ onSetupComplete }: { onSetupComplete: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof interviewSetupSchema>>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: {
      topic: "",
      difficulty: "",
    },
  });

  function onSubmit(values: z.infer<typeof interviewSetupSchema>) {
    setIsSubmitting(true);
    const url = `/ai-interview?topic=${encodeURIComponent(values.topic)}&difficulty=${encodeURIComponent(values.difficulty)}`;
    router.push(url);
    // The onSetupComplete callback will be called by the Dialog's onOpenChange
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Topic</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="technical-deep-dive">Technical Deep Dive</SelectItem>
                  <SelectItem value="system-design">System Design</SelectItem>
                  <SelectItem value="algorithms-data-structures">Algorithms & Data Structures</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a difficulty..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entry-level">Entry-level / Intern</SelectItem>
                  <SelectItem value="mid-level">Mid-level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="staff-principal">Staff / Principal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Start Interview
        </Button>
      </form>
    </Form>
  );
}


export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);

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
          <SidebarMenuItem key={item.href || item.id}>
            {item.href ? (
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
            ) : (
               <SidebarMenuButton
                onClick={() => setIsInterviewDialogOpen(true)}
                isActive={pathname.startsWith('/ai-interview')}
                tooltip={item.label}
                className="justify-start group-data-[collapsible=icon]:justify-center"
              >
                 <item.icon />
                 <span>{item.label}</span>
              </SidebarMenuButton>
            )}
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
                <span>Upgrade Plan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
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
            <SidebarMenuButton tooltip="Log Out" onClick={handleLogout} variant="ghost" className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground justify-start group-data-[collapsible=icon]:justify-center">
              <LogOut />
              <span className="sr-only">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Setup Your Mock Interview</DialogTitle>
            <DialogDescription>
              Choose a topic and difficulty to begin your practice session.
            </DialogDescription>
          </DialogHeader>
          <InterviewSetupForm onSetupComplete={() => setIsInterviewDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
