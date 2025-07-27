// src/app/(app)/layout.tsx
"use client";

import { AuthGuard, AuthProvider } from '@/hooks/use-auth';
import { UserDataProvider } from '@/hooks/use-user-data';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <UserDataProvider>
        <AuthGuard>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1">
                <AppHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                  {children}
                </main>
            </div>
          </SidebarProvider>
        </AuthGuard>
      </UserDataProvider>
  );
}
