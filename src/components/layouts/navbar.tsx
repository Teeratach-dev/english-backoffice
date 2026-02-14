"use client";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { UserNav } from "@/components/layouts/user-nav";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
