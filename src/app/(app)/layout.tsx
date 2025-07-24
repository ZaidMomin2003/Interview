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
const NO_LAYOUT_PATHS = ['/onboarding', '/calculate-salary'];


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // The Onboarding and Salary Calculator pages have their own layout.
  if (NO_LAYOUT_PATHS.includes(pathname)) {
    return (
      <AuthGuard>
        <UserDataProvider>
          {pathname === '/onboarding' ? <OnboardingCheck>{children}</OnboardingCheck> : children}
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
                          {children}
                      </div>
                  </SidebarInset>
              </SidebarProvider>
          </OnboardingCheck>
      </UserDataProvider>
    </AuthGuard>
  );
}
