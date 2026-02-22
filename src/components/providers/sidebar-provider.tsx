"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  setIsOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 801px)");
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initializing state based on screen size on first load
    if (!isInitialized) {
      setIsOpen(isDesktop);
      setIsInitialized(true);
    }
  }, [isDesktop, isInitialized]);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
