import { Navbar } from "@/components/layouts/navbar";
import { DesktopSidebar as Sidebar } from "@/components/layouts/sidebar";
import { HeaderProvider } from "@/components/providers/header-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderProvider>
      <AuthProvider>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              <main className="flex-1 p-3 min-[450px]:p-6 overflow-x-hidden">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </HeaderProvider>
  );
}
