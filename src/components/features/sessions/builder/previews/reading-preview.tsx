"use client";

import { useState } from "react";
import { ReadingAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail, Eye, EyeOff } from "lucide-react";

interface ReadingPreviewProps {
  action: ReadingAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function ReadingPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: ReadingPreviewProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (action.isHide && !action.isReadable) {
    return (
      <div className="space-y-2 w-full max-w-sm mx-auto">
        <div className="py-6 px-10 flex justify-center gap-10">
          <div
            className={cn(
              "h-11 w-11 rounded-full border flex items-center justify-center",
              action.audioUrl
                ? "bg-primary/10 border-primary/30"
                : "bg-background",
            )}
          >
            <Volume2
              className={cn(
                "h-6 w-6 transition-colors",
                action.audioUrl
                  ? "text-primary animate-pulse"
                  : "text-muted-foreground",
              )}
            />
          </div>
          <div
            className={cn(
              "h-11 w-11 rounded-full border flex items-center justify-center",
              action.audioUrl
                ? "bg-primary/10 border-primary/30"
                : "bg-background",
            )}
          >
            <Snail
              className={cn(
                "h-6 w-6 transition-colors",
                action.audioUrl
                  ? "text-primary animate-pulse"
                  : "text-muted-foreground",
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  const shouldShowEye = action.isHide;
  const isBlurry = action.isHide && !isRevealed;

  return (
    <div className="space-y-2 w-full max-w-sm mx-auto">
      <div
        className={cn(
          "p-4 rounded-lg bg-muted relative overflow-hidden",
          isShowShadow ? "shadow-sm" : "shadow-none",
          useBorder ? "border" : "border-none",
        )}
      >
        <div
          className={cn(
            "transition-all duration-300",
            isBlurry &&
              "blur-xs opacity-40 grayscale select-none pointer-events-none",
          )}
        >
          <p className="text-sm leading-relaxed text-card-foreground">
            {action.text && action.text.length > 0
              ? action.text.map((word, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-block mx-0.5 relative group/word",
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
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap z-10 hidden group-hover/word:block pointer-events-none">
                        {word.translation[0]}
                      </span>
                    )}
                  </span>
                ))
              : "No text content added yet"}
          </p>
        </div>

        {shouldShowEye && (
          <button
            type="button"
            onClick={() => setIsRevealed(!isRevealed)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground transition-colors z-20"
            aria-label={isRevealed ? "Hide content" : "Reveal content"}
          >
            {isRevealed ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <div
          className={cn(
            "h-9 w-9 rounded-full border flex items-center justify-center",
            action.audioUrl
              ? "bg-primary/10 border-primary/30"
              : "bg-background",
          )}
        >
          <Volume2
            className={cn(
              "h-5 w-5 transition-colors",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
        </div>
        <div
          className={cn(
            "h-9 w-9 rounded-full border flex items-center justify-center",
            action.audioUrl
              ? "bg-primary/10 border-primary/30"
              : "bg-background",
          )}
        >
          <Snail
            className={cn(
              "h-5 w-5 transition-colors",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
        </div>
      </div>
    </div>
  );
}
