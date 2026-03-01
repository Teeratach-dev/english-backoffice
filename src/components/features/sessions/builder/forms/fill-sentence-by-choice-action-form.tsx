import { Label } from "@/components/ui/label";
import { FillSentenceWithChoiceAction } from "@/types/action.types";
import { SentenceBuilder, SentenceSegment } from "./common/sentence-builder";

interface FillSentenceWithChoiceActionFormProps {
  action: FillSentenceWithChoiceAction;
  onChange: (updates: Partial<FillSentenceWithChoiceAction>) => void;
}

export function FillSentenceWithChoiceActionForm({
  action,
  onChange,
}: FillSentenceWithChoiceActionFormProps) {
  const updateAction = (updates: Partial<FillSentenceWithChoiceAction>) => {
    onChange(updates);
  };

  const mapToSentenceSegments = () => {
    return (action.sentence || []).map((s) => ({
      text: s.text?.text || "", // Handle potential missing text property
      isBlank: s.isBlank,
      inSentence: s.inSentence,
    }));
  };

  const handleSentenceChange = (newSegments: SentenceSegment[]) => {
    // Map back to schema structure
    // We need to preserve existing Word properties if they exist
    const newActionSentence = newSegments.map((s, i) => {
      const existingItem = action.sentence?.[i];
      const existingWord = existingItem?.text;

      return {
        text: {
          ...(existingWord || {}), // Preserve existing Word properties (bold, italic, etc.)
          text: s.text,
          translation: existingWord?.translation || [],
          isBlank: s.isBlank,
          audioUrl: existingWord?.audioUrl,
        },
        isBlank: s.isBlank,
        inSentence:
          s.inSentence !== undefined
            ? s.inSentence
            : (existingItem?.inSentence ?? true), // Default to true (in sentence)
      };
    });

    updateAction({ sentence: newActionSentence });
  };

  const toggleInSentence = (index: number) => {
    const newSentence = [...(action.sentence || [])];
    if (newSentence[index]) {
      newSentence[index] = {
        ...newSentence[index],
        inSentence: !newSentence[index].inSentence,
      };
      updateAction({ sentence: newSentence });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="">
          <Label className="text-xs font-bold uppercase text-muted-foreground mb-4 block">
            Step 1: Edit Sentence & Mark Blanks
          </Label>
          <SentenceBuilder
            sentence={mapToSentenceSegments()}
            onChange={handleSentenceChange}
          />
        </div>

        {/* Step 2: Configure Properties (Distractors) */}
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase text-muted-foreground block">
            Step 2: Configure Distractors (Hidden from Sentence)
          </Label>
          <div className="flex flex-wrap gap-2">
            {(action.sentence || []).map((segment, idx) => (
              <div
                key={idx}
                className={`
                  relative group px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer flex flex-col gap-1 min-w-15
                  ${
                    !segment.inSentence
                      ? "bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300"
                      : "bg-background border-input hover:border-primary/50 text-foreground"
                  }
                `}
                onClick={() => toggleInSentence(idx)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate max-w-25">
                    {segment.text?.text}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${!segment.inSentence ? "bg-purple-500" : "bg-muted-foreground/30"}`}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold opacity-70">
                  {!segment.inSentence ? "Choice Only" : "In Sentence"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Click on words to toggle them as{" "}
            <span className="font-bold text-purple-600">Choice Only</span>{" "}
            (Distractors). Items marked as "Choice Only" will NOT appear in the
            sentence but will be collected into the choice pool.
          </p>
        </div>
      </div>
    </div>
  );
}
