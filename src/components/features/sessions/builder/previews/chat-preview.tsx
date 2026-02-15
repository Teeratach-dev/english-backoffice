"use client";

import { ChatAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail, Eye, EyeOff } from "lucide-react";
import React from "react";

interface ChatPreviewProps {
  action: ChatAction;
}

/**
 * ChatPreview Component
 * Logic:
 * 1. isDisplay=false && isReadable=false: Show only audio control panel (horizontal)
 * 2. isDisplay=false && isReadable=true: Show blurred text (default) + Eye toggle + Audio panel
 * 3. isDisplay=true: Show normal text, ignore isReadable, no Eye toggle
 */
export function ChatPreview({ action }: ChatPreviewProps) {
  const [isRevealed, setIsRevealed] = React.useState(false);

  // Conditions based on prompt
  const isAudioOnly = !action.isDisplay && !action.isReadable;
  const isBlurryMode = !action.isDisplay && action.isReadable;
  const isNormalMode = action.isDisplay;

  // Determine if content should be blurred
  const shouldBlur = isBlurryMode && !isRevealed;

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-background shadow-md max-w-sm mx-auto flex flex-col justify-end relative overflow-hidden group/chat">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className={cn(
          "flex items-start gap-4",
          action.position === "right" ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Avatar Section */}
        <div className="shrink-0 flex flex-col items-center self-end">
          <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-indigo-500 to-primary overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-background ring-2 ring-muted/20">
            {action.sender?.imageUrl ? (
              <img
                src={action.sender.imageUrl}
                alt={action.sender.name}
                className="w-full h-full object-cover"
              />
            ) : (
              action.sender?.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <span className="text-[8px] mt-1.5 font-bold text-muted-foreground uppercase tracking-widest max-w-15 truncate text-center">
            {action.sender?.name || "User"}
          </span>
        </div>

        {/* Bubble Section */}
        <div className="flex flex-1 relative">
          <div
            className={cn(
              "rounded-2xl p-4 text-sm shadow-xs transition-all duration-300 relative min-w-[120px]",
              action.position === "right"
                ? "bg-muted text-foreground rounded-tr-none border border-muted-foreground/10"
                : "bg-muted text-foreground rounded-tl-none border border-muted-foreground/10",
              shouldBlur &&
                "blur-sm opacity-50 select-none grayscale cursor-help",
            )}
          >
            {!isNormalMode && !isBlurryMode && (
              <div className="flex justify-around">
                <Volume2
                  className={cn(
                    "h-5 w-5 hover:text-primary cursor-pointer transition-colors",
                    "text-primary animate-pulse",
                  )}
                />
                <Snail
                  className={cn(
                    "h-5 w-5 hover:text-primary cursor-pointer transition-colors",
                    "text-primary animate-pulse",
                  )}
                />
              </div>
            )}

            {!isAudioOnly && (
              <div className="leading-relaxed">
                {action.text && action.text.length > 0 ? (
                  action.text.map((word, i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-block mx-0.5",
                        word.bold && "font-bold",
                        word.italic &&
                          (action.position === "right"
                            ? ""
                            : "italic text-orange-600"),
                        word.underline &&
                          "underline underline-offset-4 decoration-current/40",
                        word.highlight &&
                          (action.position === "right"
                            ? "bg-white/20 px-1 rounded-sm"
                            : "bg-primary/20 text-primary px-1 rounded-sm"),
                      )}
                    >
                      {word.text}
                    </span>
                  ))
                ) : (
                  <span className="opacity-50 italic">No message...</span>
                )}
              </div>
            )}
          </div>
        </div>

        {(isNormalMode || isBlurryMode) && (
          <div
            className={cn(
              "flex flex-col gap-5 shrink-0 self-end pb-1",
              action.position === "right" ? "items-end" : "items-start",
            )}
          >
            {isBlurryMode && (
              <button
                type="button"
                onClick={() => setIsRevealed(!isRevealed)}
                className={cn(
                  "hover:text-primary cursor-pointer transition-colors text-muted-foreground active:scale-95 flex items-center justify-center",
                )}
                title={isRevealed ? "Hide content" : "Reveal content"}
              >
                {isRevealed ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
            <Volume2
              className={cn(
                "h-5 w-5 hover:text-primary cursor-pointer transition-colors text-primary animate-pulse",
              )}
            />
            <Snail
              className={cn(
                "h-5 w-5 hover:text-primary cursor-pointer transition-colors text-primary animate-pulse",
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
