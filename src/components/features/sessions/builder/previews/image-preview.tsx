"use client";

import { ImageAction } from "@/types/action.types";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  action: ImageAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function ImagePreview({
  action,
  isShowShadow = false,
  useBorder = false,
}: ImagePreviewProps) {
  const height = action.height;

  return (
    <div
      className={cn(
        "max-w-sm mx-auto",
        isShowShadow ? "shadow-sm" : "shadow-none",
        useBorder ? "border" : "border-none",
      )}
    >
      <div
        className="overflow-hidden flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        {action.url ? (
          <img
            src={action.url}
            alt="Content"
            className="w-full h-full object-contain"
          />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
