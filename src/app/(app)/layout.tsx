// src/app/(app)/layout.tsx
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthGuard } from '@/hooks/use-auth';
import { getCurrentUser } from '@/lib/session';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar user={user} />
          <div className="flex flex-col flex-1 overflow-y-auto">
            <AppHeader user={user} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
