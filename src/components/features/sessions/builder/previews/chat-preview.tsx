"use client";

import { ChatAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface ChatPreviewProps {
  action: ChatAction;
}

export function ChatPreview({ action }: ChatPreviewProps) {
  return (
    <div className="space-y-6 p-4 border rounded-2xl bg-background shadow-sm max-w-sm mx-auto min-h-75 flex flex-col justify-end">
      <div
        className={cn(
          "flex items-start gap-3",
          action.position === "right" ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div className="shrink-0 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-500 overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
            {action.sender?.imageUrl ? (
              <img
                src={action.sender.imageUrl}
                alt={action.sender.name}
                className="w-full h-full object-cover"
              />
            ) : (
              action.sender?.name?.[0] || "U"
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold text-muted-foreground max-w-15 truncate">
            {action.sender?.name || "User"}
          </span>
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col",
            action.position === "right" ? "items-end" : "items-start",
          )}
        >
          <div
            className={cn(
              "rounded-2xl p-4 text-sm shadow-sm max-w-[85%]",
              action.position === "right"
                ? "bg-indigo-600 text-white rounded-tr-none"
                : "bg-muted text-foreground rounded-tl-none border border-muted-foreground/10",
            )}
          >
            {action.text && action.text.length > 0
              ? action.text.map((word, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-block mx-0.5",
                      word.bold && "font-bold",
                      word.italic && "italic",
                      word.underline && "underline underline-offset-2",
                      word.highlight &&
                        "bg-yellow-200 dark:bg-yellow-900/40 px-0.5 rounded",
                    )}
                  >
                    {word.text}
                  </span>
                ))
              : "Message content goes here..."}
          </div>
          {!action.isDisplay && (
            <span className="text-[9px] text-destructive font-semibold uppercase mt-1">
              Hidden from student
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
