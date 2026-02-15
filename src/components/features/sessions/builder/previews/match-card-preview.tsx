import React from "react";
import { MatchCardAction } from "@/types/action.types";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardPreviewProps {
  action: MatchCardAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function MatchCardPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: MatchCardPreviewProps) {
  const items = action.items || [];

  if (items.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        No items to display
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div
        className={cn(
          "p-2 rounded-lg bg-background grid grid-cols-2 gap-x-8 gap-y-2",
          isShowShadow ? "shadow-sm" : "shadow-none",
          useBorder ? "border" : "border-none",
        )}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {/* Left Side */}
            <div className="px-3 py-2 bg-muted/60 rounded-lg text-sm text-card-foreground text-center truncate flex items-center justify-center min-h-[26px]">
              {item.left?.audioUrl ? (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              ) : (
                item.left?.text || "-"
              )}
            </div>

            {/* Right Side */}
            <div className="px-3 py-2 bg-muted/60 rounded-lg text-sm text-card-foreground text-center truncate flex items-center justify-center min-h-[26px]">
              {item.right?.audioUrl ? (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              ) : (
                item.right?.text || "-"
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
