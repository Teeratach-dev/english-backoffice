import { Label } from "@/components/ui/label";
import { WriteSentenceAction } from "@/types/action.types";
import { SentenceBuilder, SentenceSegment } from "./common/sentence-builder";

interface WriteSentenceActionFormProps {
  action: WriteSentenceAction;
  onChange: (updates: Partial<WriteSentenceAction>) => void;
}

export function WriteSentenceActionForm({
  action,
  onChange,
}: WriteSentenceActionFormProps) {
  function updateAction(updates: Partial<WriteSentenceAction>) {
    onChange(updates);
  }

  function mapToSegments(strings: string[]): SentenceSegment[] {
    return (strings || []).map((text) => ({ text, isBlank: false }));
  }

  function handleSentenceChange(newSegments: SentenceSegment[]) {
    updateAction({ sentence: newSegments.map((s) => s.text) });
  }

  function handleExpectSentenceChange(newSegments: SentenceSegment[]) {
    updateAction({ expectSentence: newSegments.map((s) => s.text) });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">
          Correct Sentence (Words)
        </Label>
        <div className="border rounded-xl p-4 bg-muted/5">
          <SentenceBuilder
            sentence={mapToSegments(action.sentence || [])}
            onChange={handleSentenceChange}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">
          Expect Sentence (for hint and give solution)
        </Label>
        <div className="border rounded-xl p-4 bg-muted/5">
          <SentenceBuilder
            sentence={mapToSegments(action.expectSentence || [])}
            isShowSuggestion={false}
            onChange={handleExpectSentenceChange}
          />
        </div>
      </div>
    </div>
  );
}
