"use client";

import { ExplainAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface ExplainPreviewProps {
  action: ExplainAction;
}

export function ExplainPreview({ action }: ExplainPreviewProps) {
  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      <div className="rounded-md p-4 relative bg-card shadow-sm border border-muted/20">
        <p
          className={cn(
            "text-card-foreground leading-loose font-medium",
            action.alignment === "center"
              ? "text-center"
              : action.alignment === "right"
                ? "text-right"
                : "text-left",
          )}
          style={{
            fontSize: action.size ? `${action.size}px` : "16px",
          }}
        >
          {action.text && action.text.length > 0
            ? action.text.map((word, i) => (
                <span
                  key={i}
                  className={cn(
                    "inline-block mx-0.5 transition-all duration-200 relative group",
                    word.bold && "font-bold",
                    word.italic && "italic",
                    word.underline &&
                      "underline  decoration-2 underline-offset-4 cursor-help",
                    word.highlight &&
                      "bg-primary text-primary-foreground px-1.5 rounded-sm shadow-sm",
                    word.translation?.length > 0 &&
                      "text-orange-600 dark:text-orange-400",
                  )}
                >
                  {word.text}
                  {word.translation?.length > 0 && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap z-10 hidden group-hover:block animate-in fade-in zoom-in duration-200 pointer-events-none">
                      {word.translation[0]}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rotate-45 rounded-sm"></div>
                    </span>
                  )}
                </span>
              ))
            : "No text content"}
        </p>
      </div>
      {action.explanation && (
        <div className="border rounded-md p-3 bg-muted/20 text-center text-xs text-muted-foreground italic border-dashed">
          {action.explanation}
        </div>
      )}
    </div>
  );
}
