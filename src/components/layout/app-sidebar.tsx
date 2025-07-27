// src/components/layout/app-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cpu, LayoutDashboard, LogOut, Settings } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUserData } from "@/hooks/use-user-data"
import { Skeleton } from "../ui/skeleton"

export function AppSidebar() {
  const { profile, loading } = useUserData()
  const { logout } = useAuth()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  if (loading) {
    return (
      <div className="hidden md:flex flex-col gap-4 p-2 border-r border-border bg-secondary/30 w-64">
        <div className="p-2 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-2 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="p-2">
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }
  
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
                 <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/dashboard')}
                    >
                        <Link href="/dashboard">
                            <LayoutDashboard />
                            Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
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
  )
}
