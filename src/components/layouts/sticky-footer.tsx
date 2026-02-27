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
        "mt-auto h-full -mx-3 min-[450px]:-mx-6 border-t bg-background px-3 min-[450px]:px-6",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between pt-2 pb-2">
        {children}
      </div>
    </div>
  );
}
