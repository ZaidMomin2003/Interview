// src/app/(app)/layout.tsx
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthGuard } from "@/hooks/with-auth";
import { UserDataProvider } from "@/hooks/use-user-data";

// Define paths that don't need the main app layout
const NO_LAYOUT_PATHS = ['/onboarding'];
const AUTH_OPTIONAL_PATHS = ['/calculate-salary'];


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
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

  if (NO_LAYOUT_PATHS.includes(pathname)) {
    return <>{children}</>;
  }
  
  // For auth-optional paths, we still show the layout if the user *is* logged in
  if (!user && AUTH_OPTIONAL_PATHS.includes(pathname)) {
     return <>{children}</>;
  }


  return (
    <AuthGuard>
      <UserDataProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="relative min-h-screen lg:p-8 p-4 bg-background text-foreground">
                {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </UserDataProvider>
    </AuthGuard>
  );
}
