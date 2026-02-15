"use client";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { useHeader } from "@/components/providers/header-provider";
import { UserProfileButton } from "./user-profile-button";

import { MobileSidebar } from "@/components/layouts/mobile-sidebar";

export function Navbar() {
  const { title } = useHeader();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <MobileSidebar />
        <div className="flex flex-col justify-center">
          {title && (
            <h1 className="text-xl font-bold tracking-tight text-foreground transition-all">
              {title}
            </h1>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserProfileButton />
        </div>
      </div>
    </div>
  );
}
