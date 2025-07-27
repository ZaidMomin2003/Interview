// src/components/layout/app-header.tsx
"use client"

import { useAuth } from "@/hooks/use-auth"
import { useUserData } from "@/hooks/use-user-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "./theme-toggle"
import { useRouter } from "next/navigation"

export function AppHeader() {
  const { logout } = useAuth()
  const { profile, loading } = useUserData()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const renderUserMenu = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      )
    }

    if (!profile) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-auto justify-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.photoURL || ''} alt={profile.displayName || 'User'} />
              <AvatarFallback>
                {profile.displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
             <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">{profile.displayName}</span>
                <span className="text-xs text-muted-foreground -mt-1">{profile.email}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div className="flex-1" />
        <ThemeToggle />
        {renderUserMenu()}
    </header>
  )
}
