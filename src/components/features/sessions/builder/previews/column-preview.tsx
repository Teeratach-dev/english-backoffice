"use client";

import { ColumnAction, ActionType } from "@/types/action.types";
import { ImagePreview } from "./image-preview";
import { ReadingPreview } from "./reading-preview";
import { AudioPreview } from "./audio-preview";

interface ColumnPreviewProps {
  action: ColumnAction;
}

export function ColumnPreview({ action }: ColumnPreviewProps) {
  const actions = action.actions || [];

  if (actions.length === 0) {
    return (
      <div className="p-4 border border-dashed rounded-lg bg-muted/30 text-center text-xs text-muted-foreground w-full max-w-sm mx-auto">
        No items in column
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {actions.map((subAction, index) => (
          <div key={index} className="w-full">
            {subAction.type === ActionType.Image && (
              <ImagePreview action={subAction as any} />
            )}
            {subAction.type === ActionType.Reading && (
              <ReadingPreview action={subAction as any} />
            )}
            {subAction.type === ActionType.Audio && (
              <AudioPreview action={subAction as any} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
