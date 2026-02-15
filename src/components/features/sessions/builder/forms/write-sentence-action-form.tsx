import { Label } from "@/components/ui/label";
import {
  ActionType,
  WriteSentenceAction,
  WriteSentenceInChatAction,
} from "@/types/action.types";
import { SentenceBuilder, SentenceSegment } from "./common/sentence-builder";

interface WriteSentenceActionFormProps {
  action: WriteSentenceAction | WriteSentenceInChatAction;
  onChange: (
    updates: Partial<WriteSentenceAction | WriteSentenceInChatAction>,
  ) => void;
}

export function WriteSentenceActionForm({
  action,
  onChange,
}: WriteSentenceActionFormProps) {
  const updateAction = (
    updates: Partial<WriteSentenceAction | WriteSentenceInChatAction>,
  ) => {
    onChange(updates);
  };

  const mapToSegments = (strings: string[]): SentenceSegment[] => {
    return (strings || []).map((text) => ({ text, isBlank: false }));
  };

  const handleSentenceChange = (newSegments: SentenceSegment[]) => {
    updateAction({ sentence: newSegments.map((s) => s.text) });
  };

  const handleExpectSentenceChange = (newSegments: SentenceSegment[]) => {
    updateAction({ expectSentence: newSegments.map((s) => s.text) });
  };

  return (
    <div className="space-y-6">
      {action.type === ActionType.WriteSentenceInChat && (
        <div className="space-y-1">
          <Label className="text-xs">Position</Label>
          <select
            value={action.position || "left"}
            onChange={(e) =>
              updateAction({
                position: e.target.value as "left" | "right",
              } as Partial<WriteSentenceInChatAction>)
            }
            className="w-full h-8 rounded-md border bg-background px-2 text-xs"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      )}

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
