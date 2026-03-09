"use client";

import { AudioAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail } from "lucide-react";

interface AudioPreviewProps {
  action: AudioAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function AudioPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: AudioPreviewProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="py-6 px-10 flex justify-center gap-10">
        <div
          className={cn(
            "h-11 w-11 rounded-full border flex items-center justify-center",
            action.audio ? "bg-primary/10 border-primary/30" : "bg-background",
          )}
        >
          <Volume2
            className={cn(
              "h-6 w-6 transition-colors",
              action.audio
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
        </div>
        <div
          className={cn(
            "h-11 w-11 rounded-full border flex items-center justify-center",
            action.audio ? "bg-primary/10 border-primary/30" : "bg-background",
          )}
        >
          <Snail
            className={cn(
              "h-6 w-6 transition-colors",
              action.audio
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
        </div>
      </div>
    </div>
  );
}
