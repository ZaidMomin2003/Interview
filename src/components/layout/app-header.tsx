// src/components/layout/app-header.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { History, Bookmark, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div className="flex-1" />
            <nav className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/history">
                        <History className="h-5 w-5" />
                        <span className="sr-only">History</span>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/bookmarks">
                        <Bookmark className="h-5 w-5" />
                         <span className="sr-only">Bookmarks</span>
                    </Link>
                </Button>
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                             <Avatar className="h-8 w-8">
                                {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                                <AvatarFallback className="text-sm font-bold bg-primary/20 text-primary">
                                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/pricing">Billing</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/#contact">Support</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </header>
    );
}
