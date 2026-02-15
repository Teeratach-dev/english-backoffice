"use client";

import { ReorderAction, Word } from "@/types/action.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface ReorderActionFormProps {
  action: ReorderAction;
  onChange: (updates: Partial<ReorderAction>) => void;
}

export function ReorderActionForm({
  action,
  onChange,
}: ReorderActionFormProps) {
  const items = action.items || [];

  function updateItem(
    index: number,
    updates: Partial<{ text: Word; sequence: number }>,
  ) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ items: newItems });
  }

  function updateItemText(index: number, text: string) {
    const currentItem = items[index];
    const newWord: Word = {
      ...(currentItem.text || {}),
      text: text,
      // Default formatting
      translation: currentItem.text?.translation || [],
      isBlank: currentItem.text?.isBlank || false,
    };
    updateItem(index, { text: newWord });
  }

  function addItem() {
    const newItem = {
      text: {
        text: "",
        translation: [],
        isBlank: false,
      },
      sequence: items.length + 1,
    };
    onChange({ items: [...items, newItem] });
  }

  function removeItem(index: number) {
    const newItems = items.filter((_, i) => i !== index);
    // Re-assign sequences
    const reordered = newItems.map((item, i) => ({
      ...item,
      sequence: i + 1,
    }));
    onChange({ items: reordered });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Reorder Items</Label>
          <span className="text-[10px] text-muted-foreground">
            {items.length} items
          </span>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Add words or phrases in the correct order.
        </p>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border group"
            >
              <span className="text-xs text-muted-foreground w-4 text-center">
                {index + 1}
              </span>

              {/* Text Input */}
              <Input
                value={item.text?.text || ""}
                onChange={(e) => updateItemText(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="h-9 text-sm flex-1"
              />

              {/* Delete Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full text-xs h-8 border-dashed gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
