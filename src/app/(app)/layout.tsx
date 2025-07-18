import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="relative min-h-screen lg:p-8 p-4">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
