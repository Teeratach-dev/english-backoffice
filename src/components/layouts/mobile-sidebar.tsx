"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarRoutes } from "@/components/layouts/sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="pr-4 hover:opacity-75 transition min-[801px]:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background">
        <SidebarRoutes onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
