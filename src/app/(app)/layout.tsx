// src/app/(app)/layout.tsx
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth, AuthGuard } from "@/hooks/use-auth";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserDataProvider, useUserData } from "@/hooks/use-user-data";

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

  // For auth-optional paths, we still show the layout if the user *is* logged in
  if (!user && AUTH_OPTIONAL_PATHS.includes(pathname)) {
     return <>{children}</>;
  }

  // The onboarding check will now happen inside the UserDataProvider
  const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
    const { profile, loading: userDataLoading } = useUserData();
    
    useEffect(() => {
      const hasOnboarded = profile?.displayName;
      if (!userDataLoading && user && !hasOnboarded && pathname !== '/onboarding') {
        router.push('/onboarding');
      }
    }, [profile, userDataLoading, user, pathname, router]);

    return <>{children}</>;
  }


  if (NO_LAYOUT_PATHS.includes(pathname)) {
    return (
      // Onboarding still needs the UserDataProvider to save the profile
      <UserDataProvider>
        <AuthGuard>
            {children}
        </AuthGuard>
      </UserDataProvider>
    );
  }

  return (
    <UserDataProvider>
        <AuthGuard>
            <OnboardingCheck>
                <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <AppHeader />
                    <div className="relative min-h-screen lg:p-8 p-4 bg-background text-foreground">
                        {children}
                    </div>
                </SidebarInset>
                </SidebarProvider>
            </OnboardingCheck>
        </AuthGuard>
    </UserDataProvider>
  );
}
