"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextType {
  title: string;
  setHeader: (title: string) => void;
  clearHeader: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("");

  function setHeader(newTitle: string) {
    setTitle(newTitle);
  }

  function clearHeader() {
    setTitle("");
  }

  return (
    <HeaderContext.Provider value={{ title, setHeader, clearHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
