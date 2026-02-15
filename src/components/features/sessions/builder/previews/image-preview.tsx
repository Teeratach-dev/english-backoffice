"use client";

import { ImageAction } from "@/types/action.types";
import { ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  action: ImageAction;
}

export function ImagePreview({ action }: ImagePreviewProps) {
  return (
    <div className="p-2 border rounded-2xl bg-background shadow-lg overflow-hidden max-w-sm mx-auto">
      <div className="aspect-video bg-muted rounded-xl relative overflow-hidden flex items-center justify-center border border-muted-foreground/10">
        {action.url ? (
          <img
            src={action.url}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="h-16 w-16 text-muted-foreground/20" />
        )}
      </div>
      <div className="p-3 text-center">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Image Content
        </p>
      </div>
    </div>
  );
}
