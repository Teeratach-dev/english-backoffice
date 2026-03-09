"use client";

import { useState, useEffect } from "react";
import { ImageAction } from "@/types/action.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarginFields } from "./margin-fields";

interface ImageActionFormProps {
  action: ImageAction;
  onChange: (updates: Partial<ImageAction>) => void;
}

export function ImageActionForm({ action, onChange }: ImageActionFormProps) {
  const [heightValue, setHeightValue] = useState(String(action.height));

  useEffect(() => {
    setHeightValue(String(action.height));
  }, [action.height]);

  function handleChange(updates: Partial<ImageAction>) {
    onChange(updates);
  }

  return (
    <div className="space-y-4">
      <MarginFields
        marginTop={action.marginTop}
        marginBottom={action.marginBottom}
        onChange={(updates) => handleChange(updates)}
      />
      <div>
        <Label
          htmlFor="imageHeight"
          className="text-xs font-medium text-muted-foreground"
        >
          Height (px)
        </Label>
        <Input
          id="imageHeight"
          type="number"
          min={50}
          placeholder="300"
          value={heightValue}
          onChange={(e) => {
            setHeightValue(e.target.value);
            const num = Number(e.target.value);
            if (!isNaN(num) && e.target.value !== "")
              handleChange({ height: num });
          }}
          onBlur={() => {
            const parsed = Number(heightValue);
            const num = isNaN(parsed) || parsed < 0 ? 0 : parsed;
            setHeightValue(String(num));
            handleChange({ height: num });
          }}
          className="h-9 text-sm"
        />
      </div>
      <div>
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
    </div>
  );
}
