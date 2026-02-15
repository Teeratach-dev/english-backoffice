import { FillSentenceWithChoiceAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface FillSentenceByChoicePreviewProps {
  action: FillSentenceWithChoiceAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function FillSentenceByChoicePreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: FillSentenceByChoicePreviewProps) {
  const sentence = action.sentence || [];

  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          "p-6 rounded-lg bg-background w-full max-w-sm space-y-6",
          isShowShadow ? "shadow-sm" : "shadow-none",
          useBorder ? "border" : "border-none",
        )}
      >
        <div className="text-sm text-center text-card-foreground leading-relaxed">
          {sentence.length === 0 ? (
            <span className="text-muted-foreground italic">Empty sentence</span>
          ) : (
            sentence
              .filter((s) => s.inSentence) // Filter out "Choice Only" items (distractors)
              .map((segment, idx) => (
                <span key={idx}>
                  {segment.isBlank ? (
                    <span className="tracking-widest">
                      {segment.text.text.split("").map((_, i) => (
                        <span key={i}>_</span>
                      ))}
                    </span>
                  ) : (
                    <span>{segment.text.text} </span>
                  )}{" "}
                </span>
              ))
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {(() => {
            const choices = sentence.filter((s) => s.isBlank || !s.inSentence);

            if (choices.length === 0) {
              return (
                <div className="text-sm text-muted-foreground italic opacity-50">
                  No choices configured
                </div>
              );
            }

            return choices.map((s, i) => (
              <div
                key={i}
                className="px-3 py-1 bg-muted/60 border rounded-lg text-sm text-card-foreground"
              >
                {s.text.text}
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
