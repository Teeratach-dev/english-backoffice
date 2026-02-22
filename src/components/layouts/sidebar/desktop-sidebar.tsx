"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { SidebarRoutes } from "./sidebar-routes";

interface DesktopSidebarProps {
  className?: string;
}

export function DesktopSidebar({ className }: DesktopSidebarProps) {
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
