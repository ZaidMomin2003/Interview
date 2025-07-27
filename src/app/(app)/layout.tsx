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
        <AppSidebar user={user} />
        <div className="flex flex-col flex-1">
          <AppHeader user={user} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
