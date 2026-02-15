"use client";

import { ReorderAction } from "@/types/action.types";
import { useEffect, useState } from "react";

interface ReorderPreviewProps {
  action: ReorderAction;
}

export function ReorderPreview({ action }: ReorderPreviewProps) {
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
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Pool of words (Full Set Shuffled) */}
      <div className="p-4 border rounded-lg bg-background shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="border-b border-muted-foreground/30 h-1"></div>
          <div className="border-b border-muted-foreground/30 h-1"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {shuffledPool.length > 0 ? (
            shuffledPool.map((word, i) => (
              <div
                key={i}
                className="px-3 py-1 bg-muted/60 border rounded-lg text-[10px] text-card-foreground"
              >
                {word}
              </div>
            ))
          ) : (
            <div className="text-[10px] text-muted-foreground italic">
              No items added
            </div>
          )}
        </div>
      </div>

      {/* Target Area (Simulation) */}
      <div className="p-4 border rounded-lg bg-background shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-muted-foreground/30 min-h-6">
            {/* Simulate some dropped items (Correct Order) */}
            {targetWords.map((word, i) => (
              <div
                key={i}
                className="px-2 py-0.5 bg-muted/60 rounded-lg text-[10px] text-card-foreground"
              >
                {word}
              </div>
            ))}
          </div>
          <div className="border-b border-muted-foreground/30 h-1"></div>
        </div>
        <div className="flex justify-center flex-wrap gap-2">
          {/* Simulate remaining items (Shuffled) */}
          {shuffledRemaining.map((word, i) => (
            <div
              key={i}
              className="px-3 py-1 bg-muted/60 border rounded-lg text-[10px] text-card-foreground"
            >
              {word}
            </div>
          ))}
          {/* Just some empty placeholders if no words */}
          {words.length === 0 && (
            <>
              <div className="w-12 h-6 border bg-muted/20 rounded-lg"></div>
              <div className="w-12 h-6 border bg-muted/20 rounded-lg"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
