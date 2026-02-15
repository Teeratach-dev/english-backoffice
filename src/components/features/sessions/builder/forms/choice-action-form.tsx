"use client";

import { ChoiceAction, Word } from "@/types/action.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChoiceActionFormProps {
  action: ChoiceAction;
  onChange: (updates: Partial<ChoiceAction>) => void;
}

export function ChoiceActionForm({ action, onChange }: ChoiceActionFormProps) {
  const items = action.items || [];

  function updateItem(
    index: number,
    updates: Partial<{ text: Word; isCorrect: boolean }>,
  ) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ items: newItems });
  }

  function updateItemText(index: number, text: string) {
    const currentItem = items[index];
    const newWord: Word = {
      ...currentItem.text,
      text: text,
      // Default formatting if not present
      translation: currentItem.text.translation || [],
      isBlank: currentItem.text.isBlank || false,
    };
    updateItem(index, { text: newWord });
  }

  function toggleCorrect(index: number) {
    // Enforce single correct choice:
    // If we are selecting a new correct answer, unselect all others.
    // If we are unselecting the current correct answer, just unselect it.
    const newItems = items.map((item, i) => ({
      ...item,
      isCorrect: i === index ? !item.isCorrect : false,
    }));
    onChange({ items: newItems });
  }

  function addItem() {
    const newItem = {
      text: {
        text: "",
        translation: [],
        isBlank: false,
      },
      isCorrect: false,
    };
    onChange({ items: [...items, newItem] });
  }

  function removeItem(index: number) {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ items: newItems });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Choices</Label>
          <span className="text-[10px] text-muted-foreground">
            {items.length} items
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border group"
            >
              {/* Correct Answer Toggle */}
              <button
                type="button"
                onClick={() => toggleCorrect(index)}
                className={cn(
                  "shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-colors",
                  item.isCorrect
                    ? "text-green-600 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={item.isCorrect ? "Correct Answer" : "Mark as Correct"}
              >
                {item.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              {/* Text Input */}
              <Input
                value={item.text.text}
                onChange={(e) => updateItemText(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="h-9 text-sm flex-1"
              />

              {/* Delete Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
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
          Add Choice
        </Button>
      </div>
    </div>
  );
}
