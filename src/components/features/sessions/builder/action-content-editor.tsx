"use client";

import {
  Action,
  ActionType,
  ReadingAction,
  ExplainAction,
  AudioAction,
  ChatAction,
  ImageAction,
  ColumnAction,
} from "@/types/action.types";
import { WordEditor } from "./word-editor";
import { RichWordEditor } from "./rich-word-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { ReadingActionForm } from "./forms/reading-action-form";
import { ExplainActionForm } from "./forms/explain-action-form";
import { AudioActionForm } from "./forms/audio-action-form";
import { ChatActionForm } from "./forms/chat-action-form";
import { ImageActionForm } from "./forms/image-action-form";
import { ColumnActionForm } from "./forms/column-action-form";

interface ActionContentEditorProps {
  action: Action;
  onChange: (updates: Partial<Action>) => void;
}

export function ActionContentEditor({
  action,
  onChange,
}: ActionContentEditorProps) {
  const updateAction = (updates: Partial<Action>) => {
    const updatedAction = { ...action, ...updates } as Action;
    onChange(updatedAction);
  };

  switch (action.type) {
    case ActionType.Explain:
      return (
        <ExplainActionForm
          action={action}
          onChange={(updates: Partial<ExplainAction>) => updateAction(updates)}
        />
      );

    case ActionType.Reading:
      return (
        <ReadingActionForm
          action={action}
          onChange={(updates: Partial<ReadingAction>) => updateAction(updates)}
        />
      );

    case ActionType.Audio:
      return (
        <AudioActionForm
          action={action}
          onChange={(updates: Partial<AudioAction>) => updateAction(updates)}
        />
      );

    case ActionType.Image:
      return (
        <ImageActionForm
          action={action}
          onChange={(updates: Partial<ImageAction>) => updateAction(updates)}
        />
      );

    case ActionType.Chat:
      return (
        <ChatActionForm
          action={action}
          onChange={(updates: Partial<ChatAction>) => updateAction(updates)}
        />
      );

    case ActionType.Column:
      return (
        <ColumnActionForm
          action={action}
          onChange={(updates: Partial<ColumnAction>) => updateAction(updates)}
        />
      );

    case ActionType.Choice:
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase font-bold text-muted-foreground">
              Options
            </Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateAction({
                  items: [
                    ...(action.items || []),
                    {
                      text: { text: "", translation: [], isBlank: false },
                      isCorrect: false,
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add Option
            </Button>
          </div>
          {action.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-4 bg-muted/20 p-2 rounded"
            >
              <Input
                value={item.text?.text || ""}
                onChange={(e) => {
                  const items = [...action.items];
                  items[idx].text = {
                    ...items[idx].text,
                    text: e.target.value,
                  };
                  updateAction({ items });
                }}
                className="flex-1"
                placeholder="Option text"
              />
              <div className="flex items-center space-x-2 bg-background border rounded px-2 h-10">
                <Switch
                  checked={item.isCorrect}
                  onCheckedChange={(c) => {
                    const items = [...action.items];
                    items[idx].isCorrect = c;
                    updateAction({ items });
                  }}
                />
                <Label className="text-xs font-normal">Correct</Label>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  const items = action.items.filter(
                    (_: any, i: number) => i !== idx,
                  );
                  updateAction({ items });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      );

    case ActionType.MatchCard:
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase font-bold text-muted-foreground">
              Pairs
            </Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateAction({
                  items: [
                    ...(action.items || []),
                    { left: { text: "" }, right: { text: "" } },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add Pair
            </Button>
          </div>
          {action.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded items-center"
            >
              <div className="space-y-1">
                <Label className="text-[10px]">Left Side</Label>
                <Input
                  value={item.left?.text || ""}
                  onChange={(e) => {
                    const items = [...action.items];
                    items[idx].left = {
                      ...items[idx].left,
                      text: e.target.value,
                    };
                    updateAction({ items });
                  }}
                  placeholder="Text or Audio URL"
                />
              </div>
              <div className="space-y-1 relative pr-8">
                <Label className="text-[10px]">Right Side</Label>
                <Input
                  value={item.right?.text || ""}
                  onChange={(e) => {
                    const items = [...action.items];
                    items[idx].right = {
                      ...items[idx].right,
                      text: e.target.value,
                    };
                    updateAction({ items });
                  }}
                  placeholder="Text or Audio URL"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-0 -right-2 h-10"
                  onClick={() => {
                    const items = action.items.filter(
                      (_: any, i: number) => i !== idx,
                    );
                    updateAction({ items });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      );

    case ActionType.WriteSentence:
    case ActionType.WriteSentenceInChat:
      return (
        <div className="space-y-4">
          {action.type === ActionType.WriteSentenceInChat && (
            <div className="space-y-1">
              <Label className="text-xs">Position</Label>
              <select
                value={action.position || "left"}
                onChange={(e) =>
                  updateAction({ position: e.target.value as "left" | "right" })
                }
                className="w-full h-8 rounded-md border bg-background px-2 text-xs"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-xs">
              Sentences (comma separated variations)
            </Label>
            <Input
              value={action.sentence?.join(", ") || ""}
              onChange={(e) =>
                updateAction({
                  sentence: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              placeholder="Correct sentences..."
            />
          </div>
        </div>
      );

    case ActionType.FillSentenceByTyping:
    case ActionType.FillSentenceWithChoice:
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase font-bold text-muted-foreground">
              Sentence Segments
            </Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateAction({
                  sentence: [
                    ...(action.sentence || []),
                    { text: "", isBlank: false },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add Segment
            </Button>
          </div>
          {action.sentence?.map((seg: any, idx: number) => (
            <div key={idx} className="space-y-2 bg-muted/20 p-2 rounded">
              <div className="flex items-center gap-3">
                <Input
                  value={seg.text}
                  onChange={(e) => {
                    const sentence = [...action.sentence];
                    sentence[idx].text = e.target.value;
                    updateAction({ sentence });
                  }}
                  className="flex-1"
                  placeholder="Segment text"
                />
                <div className="flex items-center space-x-2 bg-background border rounded px-2 h-10 whitespace-nowrap">
                  <Switch
                    checked={seg.isBlank}
                    onCheckedChange={(c) => {
                      const sentence = [...action.sentence];
                      sentence[idx].isBlank = c;
                      updateAction({ sentence });
                    }}
                  />
                  <Label className="text-xs font-normal">Blank</Label>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className=""
                  onClick={() => {
                    const sentence = action.sentence.filter(
                      (_: any, i: number) => i !== idx,
                    );
                    updateAction({ sentence });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {seg.isBlank &&
                action.type === ActionType.FillSentenceWithChoice && (
                  <div className="pl-4 border-l-2 ml-2">
                    <Label className="text-[10px] mb-1 block">
                      Choices for this blank (comma separated)
                    </Label>
                    <Input
                      value={
                        seg.choice?.map((w: any) => w.text).join(", ") || ""
                      }
                      onChange={(e) => {
                        const sentence = [...action.sentence];
                        sentence[idx].choice = e.target.value
                          .split(",")
                          .map((t) => ({
                            text: t.trim(),
                            translation: [],
                            isBlank: false,
                          }));
                        updateAction({ sentence });
                      }}
                      placeholder="Choice A, Choice B..."
                      className="h-8 text-xs"
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="text-center py-4 text-xs text-muted-foreground italic border border-dashed rounded bg-muted/10">
          Form for {action.type} is not yet implemented.
        </div>
      );
  }
}
