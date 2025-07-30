// src/components/layout/app-header.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { History, Bookmark } from 'lucide-react';
import { useUserData } from "@/hooks/use-user-data";

export function AppHeader() {
  const { loading } = useUserData();
  const router = useRouter();

  if (loading) {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div className="flex-1" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </header>
    )
  }

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
    </header>
  );
}
