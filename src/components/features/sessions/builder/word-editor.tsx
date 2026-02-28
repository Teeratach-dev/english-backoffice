"use client";

import { Word } from "@/types/action.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,


  Bold,
  Italic,
  Underline,
  Highlighter,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface WordEditorProps {
  words: Word[];
  onChange: (words: Word[]) => void;
}

export function WordEditor({ words, onChange }: WordEditorProps) {
  const addWord = () => {
    const newWord: Word = {
      text: "",
      translation: [],
      isBlank: false,
    };
    onChange([...words, newWord]);
  };

  const removeWord = (index: number) => {
    onChange(words.filter((_, i) => i !== index));
  };

  const updateWord = (index: number, updates: Partial<Word>) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], ...updates };
    onChange(newWords);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Words / Content
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addWord}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Word
        </Button>
      </div>

      <div className="grid gap-3">
        {words.map((word, idx) => (
          <Card
            key={idx}
            className="p-3 border-muted/50 shadow-none bg-muted/10"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Text</Label>
                    <Input
                      value={word.text}
                      onChange={(e) =>
                        updateWord(idx, { text: e.target.value })
                      }
                      placeholder="e.g. Hello"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">
                      Translation (comma separated)
                    </Label>
                    <Input
                      value={word.translation.join(", ")}
                      onChange={(e) =>
                        updateWord(idx, {
                          translation: e.target.value
                            .split(",")
                            .map((t) => t.trim()),
                        })
                      }
                      placeholder="e.g. สวัสดี"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`blank-${idx}`}
                      checked={word.isBlank}
                      onCheckedChange={(checked) =>
                        updateWord(idx, { isBlank: checked })
                      }
                    />
                    <Label htmlFor={`blank-${idx}`} className="text-[10px]">
                      Is Blank
                    </Label>
                  </div>

                  <div className="flex items-center gap-1 border rounded-md p-1 bg-background">
                    <Button
                      variant={word.bold ? "secondary" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateWord(idx, { bold: !word.bold })}
                    >
                      <Bold className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={word.italic ? "secondary" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateWord(idx, { italic: !word.italic })}
                    >
                      <Italic className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={word.underline ? "secondary" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        updateWord(idx, { underline: !word.underline })
                      }
                    >
                      <Underline className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={word.highlight ? "secondary" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        updateWord(idx, { highlight: !word.highlight })
                      }
                    >
                      <Highlighter className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <Input
                      placeholder="Audio URL (optional)"
                      value={word.audioUrl || ""}
                      onChange={(e) =>
                        updateWord(idx, { audioUrl: e.target.value })
                      }
                      className="h-7 text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeWord(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        {words.length === 0 && (
          <div className="text-center py-4 border rounded-lg border-dashed text-muted-foreground text-xs italic">
            No words added yet. Click "Add Word" to start.
          </div>
        )}
      </div>
    </div>
  );
}
