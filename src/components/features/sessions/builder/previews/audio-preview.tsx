"use client";

import { AudioAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail } from "lucide-react";

interface AudioPreviewProps {
  action: AudioAction;
}

/**
 * AudioPreview Component
 *
 * แสดงผลพรีวิวสำหรับ Audio Action โดยเลียนแบบสไตล์จาก ReadingPreview
 * ในกรณีที่แสดงเฉพาะแผงควบคุมเสียง
 */
export function AudioPreview({ action }: AudioPreviewProps) {
  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      <div className="p-4 border rounded-lg bg-background shadow-sm flex items-center justify-center gap-10 relative overflow-hidden">
        <Volume2
          className={cn(
            "h-6 w-6 transition-colors",
            action.audio
              ? "text-primary animate-pulse"
              : "text-muted-foreground",
          )}
        />
        <Snail
          className={cn(
            "h-6 w-6 transition-colors",
            action.audio
              ? "text-primary animate-pulse"
              : "text-muted-foreground",
          )}
        />
      </div>
    </div>
  );
}
