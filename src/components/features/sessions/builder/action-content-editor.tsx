"use client";

import { Action, ActionType } from "@/types/action.types";
import { WordEditor } from "./word-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface ActionContentEditorProps {
  action: Action;
  onChange: (updates: Partial<Action>) => void;
}

export function ActionContentEditor({
  action,
  onChange,
}: ActionContentEditorProps) {
  const updateContent = (updates: any) => {
    onChange({ content: { ...action.content, ...updates } });
  };

  switch (action.type) {
    case ActionType.Explain:
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Alignment</Label>
              <select
                value={action.content.alignment || "left"}
                onChange={(e) => updateContent({ alignment: e.target.value })}
                className="w-full h-8 rounded-md border bg-background px-2 text-xs"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Font Size</Label>
              <Input
                type="number"
                value={action.content.size || 16}
                onChange={(e) =>
                  updateContent({ size: parseInt(e.target.value) })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>
          <WordEditor
            words={action.content.text || []}
            onChange={(words) => updateContent({ text: words })}
          />
        </div>
      );

    case ActionType.Reading:
      return (
        <div className="space-y-4">
          <div className="flex gap-4 p-2 bg-muted/30 rounded-md">
            <div className="flex items-center space-x-2">
              <Switch
                id="isHide"
                checked={action.content.isHide}
                onCheckedChange={(c) => updateContent({ isHide: c })}
              />
              <Label htmlFor="isHide" className="text-xs font-normal">
                Hidden
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isReadable"
                checked={action.content.isReadable}
                onCheckedChange={(c) => updateContent({ isReadable: c })}
              />
              <Label htmlFor="isReadable" className="text-xs font-normal">
                Readable
              </Label>
            </div>
            <div className="flex-1">
              <Input
                placeholder="Background Audio URL"
                value={action.content.audioUrl || ""}
                onChange={(e) => updateContent({ audioUrl: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <WordEditor
            words={action.content.text || []}
            onChange={(words) => updateContent({ text: words })}
          />
        </div>
      );

    case ActionType.Audio:
      return (
        <div className="space-y-2">
          <Label className="text-xs">Audio URL</Label>
          <Input
            value={action.content.audio || ""}
            onChange={(e) => updateContent({ audio: e.target.value })}
            placeholder="https://example.com/audio.mp3"
          />
        </div>
      );

    case ActionType.Image:
      return (
        <div className="space-y-2">
          <Label className="text-xs">Image URL</Label>
          <Input
            value={action.content.url || ""}
            onChange={(e) => updateContent({ url: e.target.value })}
            placeholder="https://example.com/image.png"
          />
        </div>
      );

    case ActionType.Chat:
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Sender Name</Label>
              <Input
                value={action.content.sender?.name || ""}
                onChange={(e) =>
                  updateContent({
                    sender: { ...action.content.sender, name: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Sender Image URL</Label>
              <Input
                value={action.content.sender?.imageUrl || ""}
                onChange={(e) =>
                  updateContent({
                    sender: {
                      ...action.content.sender,
                      imageUrl: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Position</Label>
              <select
                value={action.content.position || "left"}
                onChange={(e) => updateContent({ position: e.target.value })}
                className="w-full h-8 rounded-md border bg-background px-2 text-xs"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="space-y-1 flex items-end gap-4 pb-1">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={action.content.isDisplay}
                  onCheckedChange={(c) => updateContent({ isDisplay: c })}
                />
                <Label className="text-xs font-normal">Display</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={action.content.isReadable}
                  onCheckedChange={(c) => updateContent({ isReadable: c })}
                />
                <Label className="text-xs font-normal">Readable</Label>
              </div>
            </div>
          </div>
          <WordEditor
            words={action.content.text || []}
            onChange={(words) => updateContent({ text: words })}
          />
        </div>
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
                updateContent({
                  items: [
                    ...(action.content.items || []),
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
          {action.content.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-4 bg-muted/20 p-2 rounded"
            >
              <Input
                value={item.text?.text || ""}
                onChange={(e) => {
                  const items = [...action.content.items];
                  items[idx].text = {
                    ...items[idx].text,
                    text: e.target.value,
                  };
                  updateContent({ items });
                }}
                className="flex-1"
                placeholder="Option text"
              />
              <div className="flex items-center space-x-2 bg-background border rounded px-2 h-10">
                <Switch
                  checked={item.isCorrect}
                  onCheckedChange={(c) => {
                    const items = [...action.content.items];
                    items[idx].isCorrect = c;
                    updateContent({ items });
                  }}
                />
                <Label className="text-xs font-normal">Correct</Label>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  const items = action.content.items.filter(
                    (_: any, i: number) => i !== idx,
                  );
                  updateContent({ items });
                }}
              >
                <Trash className="h-4 w-4" />
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
                updateContent({
                  items: [
                    ...(action.content.items || []),
                    { left: { text: "" }, right: { text: "" } },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add Pair
            </Button>
          </div>
          {action.content.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded items-center"
            >
              <div className="space-y-1">
                <Label className="text-[10px]">Left Side</Label>
                <Input
                  value={item.left?.text || ""}
                  onChange={(e) => {
                    const items = [...action.content.items];
                    items[idx].left = {
                      ...items[idx].left,
                      text: e.target.value,
                    };
                    updateContent({ items });
                  }}
                  placeholder="Text or Audio URL"
                />
              </div>
              <div className="space-y-1 relative pr-8">
                <Label className="text-[10px]">Right Side</Label>
                <Input
                  value={item.right?.text || ""}
                  onChange={(e) => {
                    const items = [...action.content.items];
                    items[idx].right = {
                      ...items[idx].right,
                      text: e.target.value,
                    };
                    updateContent({ items });
                  }}
                  placeholder="Text or Audio URL"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive absolute bottom-0 -right-2 h-10"
                  onClick={() => {
                    const items = action.content.items.filter(
                      (_: any, i: number) => i !== idx,
                    );
                    updateContent({ items });
                  }}
                >
                  <Trash className="h-4 w-4" />
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
                value={action.content.position || "left"}
                onChange={(e) => updateContent({ position: e.target.value })}
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
              value={action.content.sentence?.join(", ") || ""}
              onChange={(e) =>
                updateContent({
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
                updateContent({
                  sentence: [
                    ...(action.content.sentence || []),
                    { text: "", isBlank: false },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add Segment
            </Button>
          </div>
          {action.content.sentence?.map((seg: any, idx: number) => (
            <div key={idx} className="space-y-2 bg-muted/20 p-2 rounded">
              <div className="flex items-center gap-3">
                <Input
                  value={seg.text}
                  onChange={(e) => {
                    const sentence = [...action.content.sentence];
                    sentence[idx].text = e.target.value;
                    updateContent({ sentence });
                  }}
                  className="flex-1"
                  placeholder="Segment text"
                />
                <div className="flex items-center space-x-2 bg-background border rounded px-2 h-10 whitespace-nowrap">
                  <Switch
                    checked={seg.isBlank}
                    onCheckedChange={(c) => {
                      const sentence = [...action.content.sentence];
                      sentence[idx].isBlank = c;
                      updateContent({ sentence });
                    }}
                  />
                  <Label className="text-xs font-normal">Blank</Label>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    const sentence = action.content.sentence.filter(
                      (_: any, i: number) => i !== idx,
                    );
                    updateContent({ sentence });
                  }}
                >
                  <Trash className="h-4 w-4" />
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
                        const sentence = [...action.content.sentence];
                        sentence[idx].choice = e.target.value
                          .split(",")
                          .map((t) => ({
                            text: t.trim(),
                            translation: [],
                            isBlank: false,
                          }));
                        updateContent({ sentence });
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
