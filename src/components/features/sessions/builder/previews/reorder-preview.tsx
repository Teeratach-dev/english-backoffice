"use client";

import { ReorderAction } from "@/types/action.types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReorderPreviewProps {
  action: ReorderAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function ReorderPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: ReorderPreviewProps) {
  const items = action.items || [];
  const words = items.map((item) => item.text?.text || "Empty");

  // State for shuffled versions
  const [shuffledPool, setShuffledPool] = useState<string[]>([]);
  const [shuffledRemaining, setShuffledRemaining] = useState<string[]>([]);

  // Split logic for the second box
  const half = Math.floor(words.length / 2);
  const targetWords = words.slice(0, half);
  const remainingWords = words.slice(half);

  useEffect(() => {
    // Shuffle helper
    const shuffle = (array: string[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    // Shuffle the full pool for the first box
    setShuffledPool(shuffle(words));

    // Shuffle the remaining words for the second box
    setShuffledRemaining(shuffle(remainingWords));
  }, [action.items]); // Re-shuffle when items change

  return (
    <div className="space-y-2 max-w-sm mx-auto">
      <div className="space-y-6">
        <div className="flex gap-2 border-b border-muted-foreground/30 min-h-6">
          {targetWords.map((word, i) => (
            <div
              key={i}
              className="px-3 py-1 mb-1 bg-background rounded-full text-sm text-card-foreground border"
            >
              {word}
            </div>
          ))}
        </div>
        <div className="border-b border-muted-foreground/30 h-1"></div>
      </div>
      <div className="flex justify-center flex-wrap gap-2">
        {shuffledRemaining.length > 0 ? (
          shuffledRemaining.map((word, i) => (
            <div
              key={i}
              className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground"
            >
              {word}
            </div>
          ))
        ) : words.length === 0 ? (
          <>
            <div className="w-12 h-6"></div>
            <div className="w-12 h-6"></div>
          </>
        ) : null}
      </div>
    </div>
  );
}
