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
    <div className="space-y-6 max-w-sm mx-auto">
      <p className="text-sm text-center text-card-foreground">
        {sentence.length === 0 ? (
          <span className="text-muted-foreground italic">Empty sentence</span>
        ) : (
          sentence
            .filter((s) => s.inSentence)
            .map((segment, idx) => (
              <span key={idx}>
                {segment.isBlank ? (
                  <span className="inline-block w-16 border-b border-foreground mx-1 translate-y-0.5" />
                ) : (
                  <span>{segment.text.text} </span>
                )}{" "}
              </span>
            ))
        )}
      </p>

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
              className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground"
            >
              {s.text.text}
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
