import { Label } from "@/components/ui/label";
import { ActionType, WriteSentenceInChatAction } from "@/types/action.types";
import { SentenceBuilder, SentenceSegment } from "./common/sentence-builder";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface WriteSentenceInChatActionFormProps {
  action: WriteSentenceInChatAction;
  onChange: (updates: Partial<WriteSentenceInChatAction>) => void;
}

export function WriteSentenceInChatActionForm({
  action,
  onChange,
}: WriteSentenceInChatActionFormProps) {
  function updateAction(updates: Partial<WriteSentenceInChatAction>) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/30">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">
          Position
        </Label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px]",
              action.position !== "right"
                ? "text-primary font-bold"
                : "text-muted-foreground",
            )}
          >
            Left
          </span>
          <Switch
            checked={action.position === "right"}
            onCheckedChange={function (checked) {
              updateAction({
                position: checked ? "right" : "left",
              });
            }}
            className="h-4 w-7 bg-primary data-[state=unchecked]:bg-primary [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
          />
          <span
            className={cn(
              "text-[10px]",
              action.position === "right"
                ? "text-primary font-bold"
                : "text-muted-foreground",
            )}
          >
            Right
          </span>
        </div>
      </div>

      <div className="border rounded-xl p-4 bg-muted/5">
        <Label className="text-xs font-bold uppercase text-muted-foreground">
          Correct Sentence (Words)
        </Label>
        <SentenceBuilder
          sentence={mapToSegments(action.sentence || [])}
          onChange={handleSentenceChange}
        />
      </div>

      <div className="border rounded-xl p-4 bg-muted/5">
        <Label className="text-xs font-bold uppercase text-muted-foreground">
          Expect Sentence (for hint and give solution)
        </Label>
        <SentenceBuilder
          sentence={mapToSegments(action.expectSentence || [])}
          isShowSuggestion={false}
          onChange={handleExpectSentenceChange}
        />
      </div>
    </div>
  );
}
