import React from "react";
import { FillSentenceByTypingAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface FillSentenceByTypingPreviewProps {
  action: FillSentenceByTypingAction;
  isShowShadow?: boolean;
}

export function FillSentenceByTypingPreview({
  action,
  isShowShadow = true,
}: FillSentenceByTypingPreviewProps) {
  return (
    <div
      className={cn(
        "p-6 border rounded-lg bg-background max-w-sm mx-auto flex justify-center",
        isShowShadow ? "shadow-sm" : "shadow-none",
      )}
    >
      <p className="text-sm text-card-foreground">
        {(action.sentence || []).map((segment, index) => (
          <React.Fragment key={index}>
            {segment.isBlank ? (
              <span className="tracking-widest">
                {segment.text.split("").map((_, i) => (
                  <span key={i}>_</span>
                ))}
              </span>
            ) : (
              <span>{segment.text}</span>
            )}{" "}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
