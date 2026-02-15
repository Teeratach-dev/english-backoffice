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

// Helper to check if a segment exists AND is followed by another segment (path continues deeper)
const isRecursiveSegment = (pathname: string, segment: string) => {
  const parts = pathname.split("/").filter(Boolean);
  const index = parts.indexOf(segment);
  // Returns true only if segment is found AND it is NOT the last part
  return index !== -1 && index < parts.length - 1;
};

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

export function SidebarRoutes() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          English Backoffice
        </h2>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({
                  variant: item.isActive(pathname) ? "secondary" : "ghost",
                }),
                "w-full justify-start",
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pb-12 min-h-screen w-64 border-r bg-background flex flex-col",
        className,
      )}
    >
      <div className="space-y-4 py-4 flex-1">
        <SidebarRoutes />
      </div>
    </div>
  );
}
