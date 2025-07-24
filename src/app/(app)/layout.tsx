// src/app/(app)/layout.tsx
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/hooks/use-auth";
import { usePathname } from 'next/navigation';
import { UserDataProvider } from "@/hooks/use-user-data";
import { OnboardingCheck } from "@/components/feature/onboarding-check";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";


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
          <OnboardingCheck>{children}</OnboardingCheck>
        </UserDataProvider>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <UserDataProvider>
          <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                  <AppHeader />
                  <main className="relative min-h-screen lg:p-8 p-4 bg-background text-foreground">
                    <OnboardingCheck>
                      <Suspense fallback={
                          <div className="space-y-8">
                              <Skeleton className="h-12 w-1/3" />
                              <div className="grid grid-cols-3 gap-6">
                                  <div className="col-span-2 space-y-6">
                                      <Skeleton className="h-48" />
                                      <Skeleton className="h-64" />
                                  </div>
                                  <div className="col-span-1 space-y-6">
                                      <Skeleton className="h-64" />
                                      <Skeleton className="h-48" />
                                  </div>
                              </div>
                          </div>
                      }>
                          {children}
                      </Suspense>
                    </OnboardingCheck>
                  </main>
              </SidebarInset>
          </SidebarProvider>
      </UserDataProvider>
    </AuthGuard>
  );
}
