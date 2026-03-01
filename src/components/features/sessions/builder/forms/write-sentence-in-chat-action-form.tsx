import { Label } from "@/components/ui/label";
import { WriteSentenceInChatAction } from "@/types/action.types";
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
    return (strings || []).map((text) => ({
      text,
      isBlank: false,
      inSentence: false,
    }));
  }

  function handleSentenceChange(newSegments: SentenceSegment[]) {
    updateAction({ sentence: newSegments.map((s) => s.text) });
  }

  function handleExpectSentenceChange(newSegments: SentenceSegment[]) {
    updateAction({ expectSentence: newSegments.map((s) => s.text) });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-4">
        <Label className="text-xs font-bold uppercase text-muted-foreground">
          Position
        </Label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs",
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
              "text-xs",
              action.position === "right"
                ? "text-primary font-bold"
                : "text-muted-foreground",
            )}
          >
            Right
          </span>
        </div>
      </div>

      <div className="">
        <Label className="text-xs font-bold uppercase text-muted-foreground">
          Correct Sentence (Words)
        </Label>
        <SentenceBuilder
          sentence={mapToSegments(action.sentence || [])}
          onChange={handleSentenceChange}
        />
      </div>

      <div className="">
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
