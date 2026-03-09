"use client";

import { ChoiceAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface ChoicePreviewProps {
  action: ChoiceAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function ChoicePreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: ChoicePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-y-3 max-w-sm mx-auto">
      {action.items && action.items.length > 0 ? (
        action.items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "px-6 py-2 bg-background border rounded-full text-sm text-card-foreground shadow-sm text-center",
              item.isCorrect &&
                "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
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
