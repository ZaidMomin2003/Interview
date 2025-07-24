// src/app/(app)/layout.tsx
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/hooks/use-auth";
import { UserDataProvider } from "@/hooks/use-user-data";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <UserDataProvider>
          <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                  <AppHeader />
                  <main className="relative min-h-screen lg:p-8 p-4 bg-background text-foreground">
                    {children}
                  </main>
              </SidebarInset>
          </SidebarProvider>
      </UserDataProvider>
    </AuthGuard>
  );
}
