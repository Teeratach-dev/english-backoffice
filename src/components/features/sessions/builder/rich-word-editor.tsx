"use client";

import React, { useState, useEffect } from "react";
import { Word } from "@/types/action.types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  MessageSquarePlus,
  Trash2,
  Edit3,
  Check,
  X,
  Plus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RichWordEditorProps {
  words: Word[];
  onChange: (words: Word[]) => void;
}

export function RichWordEditor({ words, onChange }: RichWordEditorProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isBulkEditing, setIsBulkEditing] = useState(true);
  const [bulkText, setBulkText] = useState("");

  useEffect(() => {
    if (isBulkEditing) {
      setBulkText(words.map((w) => w.text).join(" "));
    }
  }, [isBulkEditing, words]);

  function handleWordClick(index: number, event: React.MouseEvent) {
    if (event.shiftKey) {
      if (selectedIndices.length === 0) {
        setSelectedIndices([index]);
      } else {
        const last = selectedIndices[selectedIndices.length - 1];
        const start = Math.min(last, index);
        const end = Math.max(last, index);
        const range = Array.from(
          { length: end - start + 1 },
          (_, i) => start + i,
        );
        setSelectedIndices(Array.from(new Set([...selectedIndices, ...range])));
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (selectedIndices.includes(index)) {
        setSelectedIndices(selectedIndices.filter((i) => i !== index));
      } else {
        setSelectedIndices([...selectedIndices, index]);
      }
    } else {
      setSelectedIndices([index]);
    }
  }

  function toggleStyle(property: keyof Word) {
    const newWords = [...words];

    // Check if all selected words have this property set to true
    const allHaveIt = selectedIndices.every(
      (idx) => newWords[idx] && !!(newWords[idx] as any)[property],
    );

    selectedIndices.forEach((idx) => {
      if (newWords[idx]) {
        (newWords[idx] as any)[property] = !allHaveIt;
      }
    });

    onChange(newWords);
  }

  function handleBulkSave() {
    const newWords = bulkText
      .split(/\s+/)
      .filter((t) => t !== "")
      .map((t) => {
        // Try to preserve existing word properties if text matches?
        // For simplicity now, just create new words
        return {
          text: t,
          translation: [],
          isBlank: false,
        };
      });
    onChange(newWords);
    setIsBulkEditing(false);
    setSelectedIndices([]);
  }

  function updateTranslation(index: number, translationStr: string) {
    const newWords = [...words];
    newWords[index].translation = translationStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    onChange(newWords);
  }

  const hasSelection = selectedIndices.length > 0;

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1">
          <Button
            variant={hasSelection ? "outline" : "ghost"}
            size="sm"
            className={cn("h-8 px-2", hasSelection && "bg-primary/10")}
            onClick={() => toggleStyle("bold")}
            disabled={!hasSelection}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={hasSelection ? "outline" : "ghost"}
            size="sm"
            className={cn("h-8 px-2", hasSelection && "bg-primary/10")}
            onClick={() => toggleStyle("italic")}
            disabled={!hasSelection}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={hasSelection ? "outline" : "ghost"}
            size="sm"
            className={cn("h-8 px-2", hasSelection && "bg-primary/10")}
            onClick={() => toggleStyle("underline")}
            disabled={!hasSelection}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant={hasSelection ? "outline" : "ghost"}
            size="sm"
            className={cn("h-8 px-2", hasSelection && "bg-primary/10")}
            onClick={() => toggleStyle("highlight")}
            disabled={!hasSelection}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setIsBulkEditing(!isBulkEditing)}
            title="Bulk Edit Text"
          >
            {isBulkEditing ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Edit3 className="h-4 w-4" />
            )}
          </Button>
        </div>
        {hasSelection && (
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            {selectedIndices.length} word{selectedIndices.length > 1 ? "s" : ""}{" "}
            selected
          </span>
        )}
      </div>

      {isBulkEditing ? (
        <div className="space-y-2 animate-in fade-in duration-200">
          <textarea
            className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Type or paste your text here..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBulkEditing(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleBulkSave}>
              Apply Text Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-muted/5 rounded-xl border-2 border-dashed min-h-25 flex flex-wrap gap-x-1.5 gap-y-2.5 items-center content-start">
          {words.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-4 text-muted-foreground">
              <p className="text-xs">No text content yet.</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsBulkEditing(true)}
              >
                Add text
              </Button>
            </div>
          ) : (
            words.map((word, idx) => (
              <Popover key={idx}>
                <PopoverTrigger asChild>
                  <span
                    onClick={(e) => handleWordClick(idx, e)}
                    className={cn(
                      "px-1 rounded-sm cursor-pointer select-none transition-all duration-200",
                      word.bold && "font-bold",
                      word.italic && "italic",
                      word.underline &&
                        "underline decoration-2 underline-offset-2",
                      word.highlight &&
                        "bg-primary text-primary-foreground px-1.5",
                      selectedIndices.includes(idx)
                        ? "ring-2 ring-primary ring-offset-1 bg-primary/5 shadow-sm"
                        : "hover:bg-muted",
                    )}
                  >
                    {word.text}
                    {word.translation && word.translation.length > 0 && (
                      <span className="ml-0.5 text-[8px] align-top text-primary font-bold">
                        *
                      </span>
                    )}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 animate-in fade-in zoom-in duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold uppercase">
                        Edit Word: "{word.text}"
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-destructive"
                        onClick={() => {
                          const w = [...words];
                          w.splice(idx, 1);
                          onChange(w);
                          setSelectedIndices([]);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Text Value</Label>
                      <Input
                        value={word.text}
                        onChange={(e) => {
                          const w = [...words];
                          w[idx].text = e.target.value;
                          onChange(w);
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">
                        Translation (comma separated)
                      </Label>
                      <Input
                        value={word.translation.join(", ")}
                        onChange={(e) => updateTranslation(idx, e.target.value)}
                        placeholder="e.g. hello, hi"
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/30 ml-2"
            onClick={() => {
              const newWords = [
                ...words,
                { text: "word", translation: [], isBlank: false },
              ];
              onChange(newWords);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
      {!isBulkEditing && (
        <p className="text-[9px] text-muted-foreground italic px-1">
          * Click to select, Shift+Click for range, Ctrl+Click for multiple.
          Click on a word to edit details.
        </p>
      )}
    </div>
  );
}
