import { cn } from "@/lib/utils";
import React from "react";

interface StickyFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function StickyFooter({
  className,
  children,
  ...props
}: StickyFooterProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-md transition-all duration-300",
        "min-[801px]:left-64",
        className,
      )}
      {...props}
    >
      <div className="container flex items-center justify-between max-w-screen-2xl h-16 px-4 mx-auto">
        {children}
      </div>
    </div>
  );
}
