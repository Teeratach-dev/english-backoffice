"use client";

import { ChoiceAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface ChoicePreviewProps {
  action: ChoiceAction;
}

export function ChoicePreview({ action }: ChoicePreviewProps) {
  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm max-w-sm mx-auto flex flex-col items-center gap-3">
      {action.items && action.items.length > 0 ? (
        action.items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "px-6 py-2 rounded-xl text-[11px] shadow-sm w-full text-center transition-colors",
              item.isCorrect
                ? "bg-green-100 text-green-800 border-green-200 border dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-muted/60 text-card-foreground",
            )}
          >
            {item.text.text || "Empty option"}
          </div>
        ))
      ) : (
        <div className="text-xs text-muted-foreground py-4">
          No choices added yet
        </div>
      )}
    </div>
  );
}
