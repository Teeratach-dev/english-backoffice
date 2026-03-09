"use client";

import { ColumnAction, ActionType } from "@/types/action.types";
import { ImagePreview } from "./image-preview";
import { ReadingPreview } from "./reading-preview";
import { AudioPreview } from "./audio-preview";

interface ColumnPreviewProps {
  action: ColumnAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function ColumnPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: ColumnPreviewProps) {
  const actions = action.actions || [];

  if (actions.length === 0) {
    return (
      <div className="p-4 border border-dashed rounded-lg bg-muted/30 text-center text-xs text-muted-foreground w-full max-w-sm mx-auto">
        No items in column
      </div>
    );
  }

  const ratioClassMap: Record<string, string> = {
    "1:1": "grid-cols-2",
    "1:2": "grid-cols-3",
    "1:3": "grid-cols-4",
  };

  const ratioColSpanMap: Record<string, [string, string]> = {
    "1:1": ["col-span-1", "col-span-1"],
    "1:2": ["col-span-1", "col-span-2"],
    "1:3": ["col-span-1", "col-span-3"],
  };

  const ratio = action.ratio || "1:1";
  const gridClass = ratioClassMap[ratio] || "grid-cols-2";
  const colSpans = ratioColSpanMap[ratio] || ["col-span-1", "col-span-1"];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`grid ${gridClass} gap-4 items-center`}>
        {actions.map((subAction, index) => (
          <div key={index} className={`w-full ${colSpans[index] || ""}`}>
            {subAction.type === ActionType.Image && (
              <ImagePreview
                action={subAction as any}
                isShowShadow={isShowShadow}
                useBorder={useBorder}
              />
            )}
            {subAction.type === ActionType.Reading && (
              <ReadingPreview
                action={subAction as any}
                isShowShadow={isShowShadow}
                useBorder={true}
              />
            )}
            {subAction.type === ActionType.Audio && (
              <AudioPreview
                action={subAction as any}
                isShowShadow={isShowShadow}
                useBorder={true}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
