"use client";

import { ReadingAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail } from "lucide-react";

interface ReadingPreviewProps {
  action: ReadingAction;
}

export function ReadingPreview({ action }: ReadingPreviewProps) {
  if (!action.isReadable) {
    return (
      <div className="space-y-3 w-full max-w-sm mx-auto">
        <div className="p-4 border rounded-lg bg-background shadow-sm flex items-center justify-center gap-10 relative overflow-hidden">
          <Volume2
            className={cn(
              "h-6 w-6 transition-colors",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
          <Snail className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      <div className="p-4 border rounded-lg bg-background shadow-sm flex gap-4 relative overflow-hidden">
        {/* Left Side: Audio Controls panel (Matching selector style) */}
        <div className="flex flex-col gap-3 shrink-0 py-0.5">
          <Volume2
            className={cn(
              "h-5 w-5 transition-colors",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
          <Snail className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Right Side: Main Text Content with [11px] font size */}
        <div
          className={cn(
            "flex-1 transition-all duration-300",
            action.isHide &&
              "blur-[2px] opacity-40 grayscale select-none pointer-events-none",
          )}
        >
          <p className="text-[11px] leading-relaxed text-card-foreground">
            {action.text && action.text.length > 0
              ? action.text.map((word, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-block mx-0.5 relative group",
                      word.bold && "font-bold",
                      word.italic && "italic",
                      word.underline &&
                        "underline decoration-orange-400 decoration-1 underline-offset-4",
                      word.highlight &&
                        "bg-primary/20 text-primary px-0.5 rounded-sm",
                      word.translation?.length > 0 &&
                        "text-orange-600 dark:text-orange-400",
                    )}
                  >
                    {word.text}
                    {word.translation?.length > 0 && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap z-10 hidden group-hover:block pointer-events-none">
                        {word.translation[0]}
                      </span>
                    )}
                  </span>
                ))
              : "No text content added yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
