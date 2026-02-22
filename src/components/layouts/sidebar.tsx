"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  Users,
  Settings,
  Folder,
  ListChecks,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useSidebar } from "@/components/providers/sidebar-provider";

// Helper to check if a segment exists AND is followed by another segment (path continues deeper)
function isRecursiveSegment(pathname: string, segment: string) {
  const parts = pathname.split("/").filter(Boolean);
  const index = parts.indexOf(segment);
  // Returns true only if segment is found AND it is NOT the last part
  return index !== -1 && index < parts.length - 1;
}

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    name: "Courses",
    href: "/courses",
    icon: BookOpen,
    isActive: (pathname: string) =>
      pathname.startsWith("/courses") && !isRecursiveSegment(pathname, "units"),
  },
  {
    name: "Units",
    href: "/units",
    icon: Layers,
    isActive: (pathname: string) =>
      (pathname.startsWith("/units") ||
        isRecursiveSegment(pathname, "units")) &&
      !isRecursiveSegment(pathname, "topics"),
  },
  {
    name: "Topics",
    href: "/topics",
    icon: FileText,
    isActive: (pathname: string) =>
      (pathname.startsWith("/topics") ||
        isRecursiveSegment(pathname, "topics")) &&
      !isRecursiveSegment(pathname, "groups"),
  },
  {
    name: "Session Groups",
    href: "/session-groups",
    icon: Folder,
    isActive: (pathname: string) =>
      (pathname.startsWith("/session-groups") ||
        isRecursiveSegment(pathname, "groups")) &&
      !isRecursiveSegment(pathname, "sessions"),
  },
  {
    name: "Session Details",
    href: "/sessions",
    icon: ListChecks,
    isActive: (pathname: string) =>
      pathname.startsWith("/sessions") ||
      isRecursiveSegment(pathname, "sessions"),
  },
  {
    name: "Session Templates",
    href: "/session-templates",
    icon: Settings,
    isActive: (pathname: string) => pathname.startsWith("/session-templates"),
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    isActive: (pathname: string) => pathname.startsWith("/users"),
  },
];

export function SidebarRoutes({
  onNavigate,
  forceOpen,
}: {
  onNavigate?: () => void;
  forceOpen?: boolean;
}) {
  const pathname = usePathname();
  const { isOpen: sidebarOpen } = useSidebar();
  const isOpen = forceOpen || sidebarOpen;

  return (
    <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden">
      <div className="px-2 py-2">
        <h2
          className={cn(
            "mb-2 px-4 text-lg font-semibold tracking-tight whitespace-nowrap transition-all duration-300",
            !isOpen && "opacity-0 h-0 my-0 overflow-hidden",
          )}
        >
          English Backoffice
        </h2>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={!isOpen ? item.name : undefined}
              className={cn(
                buttonVariants({
                  variant: item.isActive(pathname) ? "secondary" : "ghost",
                }),
                "w-full justify-start whitespace-nowrap overflow-hidden transition-all duration-300",
                !isOpen && "justify-center px-2",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isOpen && "mr-2")} />
              <span
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  !isOpen ? "opacity-0 w-0" : "opacity-100",
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "hidden min-[801px]:flex pb-12 min-h-screen border-r bg-background flex-col transition-all duration-300 ease-in-out overflow-x-hidden",
        isOpen ? "w-50" : "w-12",
        className,
      )}
    >
      <div className="space-y-4 py-4 flex-1 flex flex-col items-center">
        <SidebarRoutes />
      </div>
    </div>
  );
}
