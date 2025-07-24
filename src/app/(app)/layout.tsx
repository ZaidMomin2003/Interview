// src/app/(app)/layout.tsx
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/hooks/use-auth";
import { usePathname } from 'next/navigation';
import { UserDataProvider } from "@/hooks/use-user-data";
import { OnboardingCheck } from "@/components/feature/onboarding-check";


// Define paths that don't need the main app layout
const NO_LAYOUT_PATHS = ['/onboarding'];
const AUTH_OPTIONAL_PATHS = ['/calculate-salary'];


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // For certain pages like the salary calculator, we can show them without the full app shell if the user isn't logged in.
  // If they are logged in, they will be wrapped in the full layout by the AuthGuard below.
  if (AUTH_OPTIONAL_PATHS.includes(pathname)) {
     return <>{children}</>;
  }
  
  // The Onboarding page has its own layout.
  if (NO_LAYOUT_PATHS.includes(pathname)) {
    return (
      <UserDataProvider>
        <AuthGuard>
            {children}
        </AuthGuard>
      </UserDataProvider>
    );
  }

  // All other authenticated routes get the full application shell.
  // The UserDataProvider wraps everything to ensure data is available.
  // The AuthGuard protects the routes and handles loading states.
  // The OnboardingCheck handles redirecting new users.
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
