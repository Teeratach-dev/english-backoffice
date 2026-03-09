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
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground text-center truncate flex items-center justify-center">
              {item.left?.audioUrl ? (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              ) : (
                item.left?.text || "-"
              )}
            </div>
            <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground text-center truncate flex items-center justify-center">
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
