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

  // The Onboarding page has its own layout and providers.
  // It's wrapped in AuthGuard to ensure a user is logged in.
  if (NO_LAYOUT_PATHS.includes(pathname)) {
    return (
      <AuthGuard>
        <UserDataProvider>
          {children}
        </UserDataProvider>
      </AuthGuard>
    );
  }

  // All other authenticated routes get the full application shell.
  // The AuthGuard protects the routes and handles loading states.
  // The UserDataProvider wraps everything to ensure data is available.
  // The OnboardingCheck handles redirecting new users.
  return (
    <AuthGuard>
      <UserDataProvider>
          <OnboardingCheck>
              <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                      <AppHeader />
                      <div className="relative min-h-screen lg:p-8 p-4 bg-background text-foreground">
                          {AUTH_OPTIONAL_PATHS.includes(pathname) ? (
                              // Render pages like salary calculator directly without the full shell if desired,
                              // but they still have access to user data if logged in.
                              children
                          ) : (
                              // The main app content area
                              children
                          )}
                      </div>
                  </SidebarInset>
              </SidebarProvider>
          </OnboardingCheck>
      </UserDataProvider>
    </AuthGuard>
  );
}
