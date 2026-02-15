import { FillSentenceByTypingAction } from "@/types/action.types";

interface FillSentenceByTypingPreviewProps {
  action: FillSentenceByTypingAction;
}

export function FillSentenceByTypingPreview({
  action,
}: FillSentenceByTypingPreviewProps) {
  const sentence = action.sentence || [];

  if (sentence.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        No sentence segments to display
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-background shadow-sm max-w-sm mx-auto flex justify-center">
      <p className="text-sm text-card-foreground leading-loose">
        {sentence.map((seg, i) => {
          if (seg.isBlank) {
            return (
              <span
                key={i}
                className="inline-block min-w-16 border-b border-foreground mx-1 text-center text-muted-foreground px-2"
              >
                {/* Visual indicator of what the answer is, or empty if preferred. 
                    Reference shows just a line. But usually editors want to see the answer.
                    The reference uses empty line. 
                    Reference: <span className="inline-block w-16 border-b border-foreground mx-1 translate-y-0.5"></span> 
                    I'll show the text faintly if it exists, or just empty?
                    The user's reference is `action-type-selector.tsx` which is static.
                    Let's show the underlying text but styled as a blank for the preview. */}
                {/* Actually reference has NO text in the span. Just a line. 
                    But for an EDITOR preview, it's useful to see what's hidden. 
                    Let's simulate the 'fillable' look. */}
                <span className="opacity-0">{seg.text || "_"}</span>
              </span>
            );
          }
          return <span key={i}>{seg.text}</span>;
        })}
      </p>
    </div>
  );
}
