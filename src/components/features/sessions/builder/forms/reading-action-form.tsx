"use client";

import { ReadingAction } from "@/types/action.types";
import { RichWordEditor } from "../rich-word-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ReadingActionFormProps {
  action: ReadingAction;
  onChange: (updates: Partial<ReadingAction>) => void;
}

export function ReadingActionForm({
  action,
  onChange,
}: ReadingActionFormProps) {
  function handleChange(updates: Partial<ReadingAction>) {
    onChange(updates);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border">
        {/* Is Hide Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="isHide"
            checked={action.isHide ?? false}
            onCheckedChange={(checked) => handleChange({ isHide: checked })}
          />
          <Label
            htmlFor="isHide"
            className="text-sm font-medium cursor-pointer"
          >
            Hidden
          </Label>
        </div>

        {/* Is Readable Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="isReadable"
            checked={action.isReadable ?? true}
            onCheckedChange={(checked) => handleChange({ isReadable: checked })}
          />
          <Label
            htmlFor="isReadable"
            className="text-sm font-medium cursor-pointer"
          >
            Readable
          </Label>
        </div>

        {/* Audio URL Input */}
        <div className="flex-1 space-y-1">
          <Label
            htmlFor="audioUrl"
            className="text-xs font-medium text-muted-foreground"
          >
            Background Audio URL
          </Label>
          <Input
            id="audioUrl"
            placeholder="https://example.com/audio.mp3"
            value={action.audioUrl || ""}
            onChange={(e) => {
              const value = e.target.value;
              handleChange({ audioUrl: value === "" ? undefined : value });
            }}
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Rich Word Editor for Text Content */}
      <div className="space-y-1">
        <Label className="text-xs font-semibold">Text</Label>
        <RichWordEditor
          words={action.text || []}
          onChange={(words) => handleChange({ text: words })}
        />
      </div>
    </div>
  );
}
