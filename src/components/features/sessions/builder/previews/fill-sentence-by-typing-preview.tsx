import React from "react";
import { FillSentenceByTypingAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface FillSentenceByTypingPreviewProps {
  action: FillSentenceByTypingAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function FillSentenceByTypingPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: FillSentenceByTypingPreviewProps) {
  return (
    <div className="flex justify-center max-w-sm mx-auto">
      <p className="text-sm text-card-foreground">
        {(action.sentence || []).map((segment, index) => (
          <React.Fragment key={index}>
            {segment.isBlank ? (
              <span className="inline-block w-16 border-b border-foreground mx-1 translate-y-0.5" />
            ) : (
              <span>{segment.text}</span>
            )}{" "}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
