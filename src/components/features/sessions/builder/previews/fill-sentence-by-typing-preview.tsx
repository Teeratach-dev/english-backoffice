import React from "react";
import { FillSentenceByTypingAction } from "@/types/action.types";

interface FillSentenceByTypingPreviewProps {
  action: FillSentenceByTypingAction;
}

export function FillSentenceByTypingPreview({
  action,
}: FillSentenceByTypingPreviewProps) {
  return (
    <div className="p-6 border rounded-lg bg-background shadow-sm max-w-sm mx-auto flex justify-center">
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
