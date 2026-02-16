import { Navbar } from "@/components/layouts/navbar";
import { Sidebar } from "@/components/layouts/sidebar";
import { HeaderProvider } from "@/components/providers/header-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col min-[801px]:flex-row">
          <Sidebar className="hidden min-[801px]:block" />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-3 min-[450px]:p-6">{children}</main>
          </div>
        </div>
      </AuthProvider>
    </HeaderProvider>
  );
}
