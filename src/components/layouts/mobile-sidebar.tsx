"use client";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarRoutes } from "@/components/layouts/sidebar";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 hover:opacity-75 transition min-[801px]:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background">
        <SidebarRoutes />
      </SheetContent>
    </Sheet>
  );
}
