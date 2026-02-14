"use client";

import { useState } from "react";
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
  Search,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Units", href: "/dashboard/units", icon: Layers },
  { name: "Topics", href: "/dashboard/topics", icon: FileText },
  { name: "Session Groups", href: "/dashboard/session-groups", icon: Folder },
  { name: "Session Details", href: "/dashboard/sessions", icon: ListChecks },
  {
    name: "Session Templates",
    href: "/dashboard/session-templates",
    icon: Settings,
  },
  { name: "Users", href: "/dashboard/users", icon: Users },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [filter, setFilter] = useState("");

  const filteredItems = sidebarItems.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase()),
  );

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
          <div className="relative mb-3 px-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter menu..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant:
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href))
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
            {filteredItems.length === 0 && (
              <p className="px-4 py-2 text-sm text-muted-foreground">
                No menu found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
