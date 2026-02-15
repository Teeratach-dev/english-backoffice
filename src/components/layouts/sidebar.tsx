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

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Units", href: "/units", icon: Layers },
  { name: "Topics", href: "/topics", icon: FileText },
  { name: "Session Groups", href: "/session-groups", icon: Folder },
  { name: "Session Details", href: "/sessions", icon: ListChecks },
  {
    name: "Session Templates",
    href: "/session-templates",
    icon: Settings,
  },
  { name: "Users", href: "/users", icon: Users },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "pb-12 min-h-screen w-64 border-r bg-background",
        className,
      )}
    >
      <div className="space-y-4 py-4">
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
                    variant:
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href))
                        ? "secondary"
                        : "ghost",
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
    </div>
  );
}
