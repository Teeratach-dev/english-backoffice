"use client";

import { ImageAction } from "@/types/action.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageActionFormProps {
  action: ImageAction;
  onChange: (updates: Partial<ImageAction>) => void;
}

export function ImageActionForm({ action, onChange }: ImageActionFormProps) {
  function handleChange(updates: Partial<ImageAction>) {
    onChange(updates);
  }

  return (
    <div className="p-4 bg-muted/30 rounded-lg border space-y-2">
      <Label
        htmlFor="imageUrl"
        className="text-xs font-medium text-muted-foreground"
      >
        Image URL
      </Label>
      <Input
        id="imageUrl"
        placeholder="https://example.com/image.png"
        value={action.url || ""}
        onChange={(e) => handleChange({ url: e.target.value })}
        className="h-9 text-sm"
      />
    </div>
  );
}
