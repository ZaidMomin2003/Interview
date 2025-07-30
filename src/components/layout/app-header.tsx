// src/components/layout/app-header.tsx
"use client";

import { useUserData } from "@/hooks/use-user-data";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { History, Bookmark, Cpu } from 'lucide-react';
import Link from "next/link";

function FourSquaresIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M10.5 4.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm1.5 1.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm7.5-6h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Zm1.5 1.5h-6v6h6v-6Zm-1.5 4.5h-3v-3h3v3Z" />
        </svg>
    )
}

export function AppHeader() {
  const { loading } = useUserData();
  const router = useRouter();

  if (loading) {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex-1" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
        </header>
    )
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="md:hidden">
         <Link href="/" className="flex items-center gap-2">
          <FourSquaresIcon className="h-8 w-8 text-primary" />
         </Link>
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
       <div className="md:hidden">
        <SidebarTrigger />
      </div>
    </header>
  );
}
