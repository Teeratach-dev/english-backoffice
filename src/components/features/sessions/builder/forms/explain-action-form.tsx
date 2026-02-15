"use client";

import { ExplainAction } from "@/types/action.types";
import { RichWordEditor } from "../rich-word-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

const FONT_SIZES = Array.from(
  { length: (144 - 2) / 2 + 1 },
  (_, i) => 2 + i * 2,
);

function FontSizePicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const [inputValue, setInputValue] = React.useState(value.toString());

  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <Popover>
      <div className="relative group flex items-center">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            const val = parseInt(e.target.value);
            if (!isNaN(val)) onChange(val);
          }}
          className="h-8 text-xs pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-8 w-8 hover:bg-transparent text-muted-foreground"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="p-1 w-20" align="end">
        <ScrollArea className="h-40">
          <div className="flex flex-col gap-0.5">
            {FONT_SIZES.map((size) => (
              <Button
                key={size}
                variant="ghost"
                size="sm"
                className={cn(
                  "justify-start font-normal h-7 px-2 text-xs rounded-sm",
                  value === size && "bg-primary/10 text-primary font-bold",
                )}
                onClick={() => {
                  onChange(size);
                }}
              >
                {size}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface ExplainActionFormProps {
  action: ExplainAction;
  onChange: (updates: Partial<ExplainAction>) => void;
}

export function ExplainActionForm({
  action,
  onChange,
}: ExplainActionFormProps) {
  function updateAction(updates: Partial<ExplainAction>) {
    onChange(updates);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs">Alignment</Label>
          <select
            value={action.alignment || "left"}
            onChange={(e) =>
              updateAction({
                alignment: e.target.value as "left" | "center" | "right",
              })
            }
            className="w-full h-8 rounded-md border bg-background px-2 text-xs"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Font Size</Label>
          <FontSizePicker
            value={action.size || 16}
            onChange={(val) => updateAction({ size: val })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-semibold">Text</Label>
        <RichWordEditor
          words={action.text || []}
          onChange={(words) => updateAction({ text: words })}
        />
      </div>
    </div>
  );
}
