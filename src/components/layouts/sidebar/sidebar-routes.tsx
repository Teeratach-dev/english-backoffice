"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { sidebarItems } from "./constants";
import { SidebarItem } from "./sidebar-item";

interface SidebarRoutesProps {
  onNavigate?: () => void;
  forceOpen?: boolean;
}

export function SidebarRoutes({ onNavigate, forceOpen }: SidebarRoutesProps) {
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
            <SidebarItem
              key={item.href}
              item={item}
              pathname={pathname}
              isOpen={isOpen}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
