"use client";

import { ImageAction } from "@/types/action.types";
import { Image as ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  action: ImageAction;
}

export function ImagePreview({ action }: ImagePreviewProps) {
  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm max-w-sm mx-auto">
      <div className="aspect-video bg-muted rounded-md relative overflow-hidden flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
        {action.url && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
            <img
              src={action.url}
              alt="Content"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
