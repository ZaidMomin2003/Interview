// src/components/layout/app-header.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";
import type { AppUser } from "@/hooks/use-user-data";
import { History, Bookmark } from 'lucide-react';

export function AppHeader({ user }: { user: AppUser | null }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const renderUserMenu = () => {
    if (!user) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.photoURL || ""}
                alt={user.displayName || "User"}
              />
              <AvatarFallback>
                {user.displayName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
             <DropdownMenuItem onClick={() => router.push('/portfolio')}>Profile</DropdownMenuItem>
             <DropdownMenuItem onClick={() => router.push('/dashboard')}>Dashboard</DropdownMenuItem>
             <DropdownMenuItem onClick={() => router.push('/pricing')}>Billing</DropdownMenuItem>
             <DropdownMenuItem>Support</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1" />
       <Button variant="ghost" size="icon" onClick={() => router.push('/history')}>
          <History className="h-5 w-5" />
          <span className="sr-only">History</span>
       </Button>
       <Button variant="ghost" size="icon" onClick={() => router.push('/bookmarks')}>
          <Bookmark className="h-5 w-5" />
          <span className="sr-only">Bookmarks</span>
       </Button>
      <ThemeToggle />
      {renderUserMenu()}
    </header>
  );
}
