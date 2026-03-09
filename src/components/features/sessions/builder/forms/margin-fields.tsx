"use client";

import { useState, useEffect } from "react";
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
  const [topValue, setTopValue] = useState(String(marginTop));
  const [bottomValue, setBottomValue] = useState(String(marginBottom));

  useEffect(() => {
    setTopValue(String(marginTop));
  }, [marginTop]);

  useEffect(() => {
    setBottomValue(String(marginBottom));
  }, [marginBottom]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label className="text-xs">Margin Top</Label>
        <Input
          type="number"
          min={0}
          value={topValue}
          onChange={(e) => {
            setTopValue(e.target.value);
            const num = parseInt(e.target.value);
            if (!isNaN(num)) onChange({ marginTop: num });
          }}
          onBlur={() => {
            const parsed = parseInt(topValue);
            const num = isNaN(parsed) || parsed < 0 ? 0 : parsed;
            setTopValue(String(num));
            onChange({ marginTop: num });
          }}
          className="h-8 text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Margin Bottom</Label>
        <Input
          type="number"
          min={0}
          value={bottomValue}
          onChange={(e) => {
            setBottomValue(e.target.value);
            const num = parseInt(e.target.value);
            if (!isNaN(num)) onChange({ marginBottom: num });
          }}
          onBlur={() => {
            const parsed = parseInt(bottomValue);
            const num = isNaN(parsed) || parsed < 0 ? 0 : parsed;
            setBottomValue(String(num));
            onChange({ marginBottom: num });
          }}
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}
