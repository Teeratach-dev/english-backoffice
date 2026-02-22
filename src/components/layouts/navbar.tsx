"use client";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { useHeader } from "@/components/providers/header-provider";
import { UserProfileButton } from "./user-profile-button";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

import { MobileSidebar } from "@/components/layouts/mobile-sidebar";

export function Navbar() {
  const { title } = useHeader();
  const { toggle } = useSidebar();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center pl-3 max-[800px]:pl-6 max-[450px]:pl-3  pr-6 max-[450px]:pr-3 ">
        <MobileSidebar />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="hidden min-[801px]:flex mr-4"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col justify-center">
          {title && (
            <h1 className="text-xl font-bold tracking-tight text-foreground transition-all">
              {title}
            </h1>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <ModeToggle />
          <UserProfileButton />
        </div>
      </div>
    </div>
  );
}
