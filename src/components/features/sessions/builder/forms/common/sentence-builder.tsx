import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Edit3, Check, MousePointerClick, Info } from "lucide-react";

export interface SentenceSegment {
  text: string;
  isBlank: boolean;
  [key: string]: any; // Allow other properties
}

interface SentenceBuilderProps {
  sentence: SentenceSegment[];
  onChange: (sentence: SentenceSegment[]) => void;
}

export function SentenceBuilder({ sentence, onChange }: SentenceBuilderProps) {
  const [isBulkEditing, setIsBulkEditing] = useState(true);
  const [bulkText, setBulkText] = useState("");

  // Initialize bulk text from sentence prop when needed
  useEffect(() => {
    // Only update if we are entering bulk edit mode or initial load
    if (isBulkEditing) {
      const currentText = (sentence || []).map((s) => s.text).join(" ");
      setBulkText(currentText);
    }
  }, [isBulkEditing, sentence]);

  const handleBulkSave = () => {
    // Split by whitespace and filter empty strings
    const newSentence = bulkText
      .split(/\s+/)
      .filter((t) => t.trim() !== "")
      .map((text) => ({
        text,
        isBlank: false,
        // We lose other properties here because the structure changed completely
      }));

    onChange(newSentence);
    setIsBulkEditing(false);
  };

  const toggleBlank = (index: number) => {
    const newSentence = [...(sentence || [])];
    if (newSentence[index]) {
      newSentence[index] = {
        ...newSentence[index],
        isBlank: !newSentence[index].isBlank,
      };
      onChange(newSentence);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Sentence Editor
          </Label>
          {!isBulkEditing && (
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {(sentence || []).length} words
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isBulkEditing ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => {
              if (isBulkEditing) {
                handleBulkSave();
              } else {
                setIsBulkEditing(true);
              }
            }}
          >
            {isBulkEditing ? (
              <>
                <Check className="h-3 w-3" /> Done
              </>
            ) : (
              <>
                <Edit3 className="h-3 w-3" /> Edit Text
              </>
            )}
          </Button>
        </div>
      </div>

      {isBulkEditing ? (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="relative">
            <textarea
              className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Type your full sentence here. It will be automatically split into words."
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <span className="text-[10px] text-muted-foreground bg-background/80 px-1 rounded">
                Press Done to split
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Type the complete sentence. When you click "Done", it will be
              split into individual words that you can configure.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 bg-muted/10 rounded-xl border min-h-25 flex flex-wrap gap-2 content-start">
            {(sentence || []).length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                <p className="text-sm">No words yet.</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsBulkEditing(true)}
                >
                  Type a sentence
                </Button>
              </div>
            ) : (
              (sentence || []).map((segment, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleBlank(idx)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 select-none border border-transparent flex items-center gap-1.5",
                    segment.isBlank
                      ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
                      : "bg-card border-border shadow-sm hover:border-primary/50 hover:shadow-md",
                  )}
                >
                  {segment.text}
                  {segment.isBlank && (
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 px-2">
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Click on words to toggle them as{" "}
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                Blanks
              </span>{" "}
              (items the user must type).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
