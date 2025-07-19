// src/app/(app)/layout.tsx
"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRequireAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";

// Define paths that don't need the main app layout
const NO_LAYOUT_PATHS = ['/onboarding'];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();
  const pathname = usePathname();
  const router = useRouter();

  // A simple check to see if a new user has completed onboarding.
  // In a real app, this would be a flag in your user's database profile.
  const hasOnboarded = user?.displayName; 

  useEffect(() => {
    if (!loading && user && !hasOnboarded && pathname !== '/onboarding') {
      // router.push('/onboarding');
    }
  }, [user, loading, hasOnboarded, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <div className="hidden md:flex flex-col gap-4 p-2 border-r border-border bg-secondary/30 w-64">
          <Skeleton className="h-10 w-full bg-muted" />
          <div className="p-2 space-y-2">
            <Skeleton className="h-8 w-full bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
          </div>
        </div>
        <div className="flex-1 p-8">
            <Skeleton className="h-12 w-1/2 mb-4 bg-muted" />
            <Skeleton className="h-8 w-3/4 mb-8 bg-muted" />
            <Skeleton className="h-64 w-full bg-muted" />
        </div>
      </div>
    );
  }

  if (NO_LAYOUT_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="md:hidden flex items-center p-2 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <SidebarTrigger />
          </Button>
        </div>
        <div className="relative min-h-screen lg:p-8 p-4 bg-background text-foreground">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
