import { Navbar } from "@/components/layouts/navbar";
import { Sidebar } from "@/components/layouts/sidebar";
import { HeaderProvider } from "@/components/providers/header-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderProvider>
      <div className="flex min-h-screen flex-col min-[801px]:flex-row">
        <Sidebar className="hidden min-[801px]:block" />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </HeaderProvider>
  );
}
