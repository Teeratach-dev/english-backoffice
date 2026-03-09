"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarginFieldsProps {
  marginTop: number;
  marginBottom: number;
  onChange: (updates: { marginTop?: number; marginBottom?: number }) => void;
}

export function MarginFields({
  marginTop,
  marginBottom,
  onChange,
}: MarginFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label className="text-xs">Margin Top</Label>
        <Input
          type="number"
          min={0}
          value={marginTop}
          onChange={(e) =>
            onChange({ marginTop: parseInt(e.target.value) || 0 })
          }
          className="h-8 text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Margin Bottom</Label>
        <Input
          type="number"
          min={0}
          value={marginBottom}
          onChange={(e) =>
            onChange({ marginBottom: parseInt(e.target.value) || 0 })
          }
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}
