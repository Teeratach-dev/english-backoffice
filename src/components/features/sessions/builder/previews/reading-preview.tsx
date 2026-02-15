"use client";

import { useState } from "react";
import { ReadingAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail, Eye, EyeOff } from "lucide-react";

interface ReadingPreviewProps {
  action: ReadingAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

/**
 * ReadingPreview Component
 *
 * แสดงผลพรีวิวสำหรับ Reading Action โดยมีเงื่อนไขดังนี้:
 * 1. ถ้า isHide = true && isReadable = false: แสดงเฉพาะแผงควบคุมเสียง
 * 2. ถ้า isHide = true && isReadable = true: แสดงข้อความแบบเบลอ (ค่าเริ่มต้น) และมีปุ่มลูกตาเพื่อ Toggle
 * 3. ถ้า isHide = false: แสดงข้อความปกติ ไม่สนใจ IsReadable และไม่มีปุ่มลูกตา
 */
export function ReadingPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: ReadingPreviewProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // เงื่อนไข: ถ้า isHide=true && isReadable=false ให้แสดงเฉพาะแผงควบคุมเสียง (Placeholder)
  if (action.isHide && !action.isReadable) {
    return (
      <div className="space-y-3 w-full max-w-sm mx-auto">
        <div
          className={cn(
            "p-4 rounded-lg bg-muted flex items-center justify-center gap-10 relative overflow-hidden",
            isShowShadow ? "shadow-sm" : "shadow-none",
            useBorder ? "border" : "border-none",
          )}
        >
          <Volume2
            className={cn(
              "h-6 w-6 transition-colors",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
          <Snail
            className={cn(
              "h-6 w-6 transition-colors",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
        </div>
      </div>
    );
  }

  // กำหนดสถานะการแสดงผล
  const shouldShowEye = action.isHide;
  const isBlurry = action.isHide && !isRevealed;

  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      <div
        className={cn(
          "p-4 rounded-lg bg-muted flex gap-4 relative overflow-hidden",
          isShowShadow ? "shadow-sm" : "shadow-none",
          useBorder ? "border" : "border-none",
        )}
      >
        {/* ส่วนควบคุมเสียง (Audio Controls) */}
        <div className="flex flex-col gap-3 shrink-0 py-0.5">
          <Volume2
            className={cn(
              "h-5 w-5",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
          <Snail
            className={cn(
              "h-5 w-5 text-muted-foreground",
              action.audioUrl
                ? "text-primary animate-pulse"
                : "text-muted-foreground",
            )}
          />
        </div>

        {/* ส่วนเนื้อหาข้อความ (Text Content) */}
        <div
          className={cn(
            "flex-1 transition-all duration-300",
            isBlurry &&
              "blur-xs opacity-40 grayscale select-none pointer-events-none",
          )}
        >
          <p className="text-sm leading-relaxed text-card-foreground">
            {action.text && action.text.length > 0
              ? action.text.map((word, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-block mx-0.5 relative group/word",
                      word.bold && "font-bold",
                      word.italic && "italic",
                      word.underline &&
                        "underline decoration-orange-400 decoration-1 underline-offset-4",
                      word.highlight &&
                        "bg-primary/20 text-primary px-0.5 rounded-sm",
                      word.translation?.length > 0 &&
                        "text-orange-600 dark:text-orange-400",
                    )}
                  >
                    {word.text}
                    {word.translation?.length > 0 && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap z-10 hidden group-hover/word:block pointer-events-none">
                        {word.translation[0]}
                      </span>
                    )}
                  </span>
                ))
              : "No text content added yet"}
          </p>
        </div>

        {/* ปุ่ม Toggle รูปตา (Eye Toggle Button) */}
        {shouldShowEye && (
          <button
            type="button"
            onClick={() => setIsRevealed(!isRevealed)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground transition-colors z-20"
            aria-label={isRevealed ? "Hide content" : "Reveal content"}
          >
            {isRevealed ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
