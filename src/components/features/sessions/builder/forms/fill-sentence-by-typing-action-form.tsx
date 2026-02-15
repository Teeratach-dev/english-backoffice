import { FillSentenceByTypingAction } from "@/types/action.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

interface FillSentenceByTypingActionFormProps {
  action: FillSentenceByTypingAction;
  onChange: (updates: Partial<FillSentenceByTypingAction>) => void;
}

export function FillSentenceByTypingActionForm({
  action,
  onChange,
}: FillSentenceByTypingActionFormProps) {
  const updateAction = (updates: Partial<FillSentenceByTypingAction>) => {
    onChange(updates);
  };

  const handleAddSegment = () => {
    updateAction({
      sentence: [...(action.sentence || []), { text: "", isBlank: false }],
    });
  };

  const handleUpdateSegment = (
    index: number,
    field: "text" | "isBlank",
    value: any,
  ) => {
    const sentence = [...(action.sentence || [])];
    if (!sentence[index]) return;

    sentence[index] = {
      ...sentence[index],
      [field]: value,
    };
    updateAction({ sentence });
  };

  const handleDeleteSegment = (index: number) => {
    const sentence = (action.sentence || []).filter((_, i) => i !== index);
    updateAction({ sentence });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Sentence Segments
        </Label>
        <Button size="sm" variant="outline" onClick={handleAddSegment}>
          <Plus className="h-4 w-4 mr-1" /> Add Segment
        </Button>
      </div>

      <div className="space-y-2">
        {(action.sentence || []).map((seg, idx) => (
          <div key={idx} className="space-y-2 bg-muted/20 p-2 rounded">
            <div className="flex items-center gap-3">
              <Input
                value={seg.text}
                onChange={(e) =>
                  handleUpdateSegment(idx, "text", e.target.value)
                }
                className="flex-1"
                placeholder="Segment text"
              />
              <div className="flex items-center space-x-2 bg-background border rounded px-2 h-10 whitespace-nowrap">
                <Switch
                  checked={seg.isBlank}
                  onCheckedChange={(c) =>
                    handleUpdateSegment(idx, "isBlank", c)
                  }
                />
                <Label className="text-xs font-normal">Blank</Label>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteSegment(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {(action.sentence || []).length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            No segments added. Click "Add Segment" to start constructing the
            sentence.
          </div>
        )}
      </div>
    </div>
  );
}
