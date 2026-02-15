import React from "react";
import { MatchCardAction } from "@/types/action.types";
import { Volume2 } from "lucide-react";

interface MatchCardPreviewProps {
  action: MatchCardAction;
}

export function MatchCardPreview({ action }: MatchCardPreviewProps) {
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
      <div className="p-4 border rounded-lg bg-background shadow-sm grid grid-cols-2 gap-x-8 gap-y-2">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {/* Left Side */}
            <div className="px-2 py-1 bg-muted/60 rounded-lg text-[10px] text-card-foreground text-center truncate flex items-center justify-center min-h-[26px]">
              {item.left?.audioUrl ? (
                <Volume2 className="h-3 w-3 text-muted-foreground" />
              ) : (
                item.left?.text || "-"
              )}
            </div>

            {/* Right Side */}
            <div className="px-2 py-1 bg-muted/60 rounded-lg text-[10px] text-card-foreground text-center truncate flex items-center justify-center min-h-[26px]">
              {item.right?.audioUrl ? (
                <Volume2 className="h-3 w-3 text-muted-foreground" />
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
