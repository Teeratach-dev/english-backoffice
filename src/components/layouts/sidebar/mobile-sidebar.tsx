"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarRoutes } from "./sidebar-routes";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="pr-4 hover:opacity-75 transition min-[801px]:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 pt-2 bg-background w-fit min-w-60 max-w-[calc(100%-3rem)]"
      >
        <SidebarRoutes onNavigate={() => setOpen(false)} forceOpen={true} />
      </SheetContent>
    </Sheet>
  );
}
