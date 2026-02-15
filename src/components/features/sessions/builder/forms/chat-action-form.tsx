"use client";

import { ChatAction } from "@/types/action.types";
import { RichWordEditor } from "../rich-word-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignLeft, AlignRight } from "lucide-react";

interface ChatActionFormProps {
  action: ChatAction;
  onChange: (updates: Partial<ChatAction>) => void;
}

export function ChatActionForm({ action, onChange }: ChatActionFormProps) {
  function updateAction(updates: Partial<ChatAction>) {
    onChange(updates);
  }

  function updateSender(updates: Partial<{ name: string; imageUrl: string }>) {
    updateAction({
      sender: {
        name: action.sender?.name ?? "",
        imageUrl: action.sender?.imageUrl ?? "",
        ...updates,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
        {/* Sender Info */}
        <div className="space-y-4 col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="senderName" className="text-xs">
                Sender Name
              </Label>
              <Input
                id="senderName"
                placeholder="Sender Name"
                value={action.sender?.name ?? ""}
                onChange={(e) =>
                  updateSender({ name: e.target.value || (null as any) })
                }
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="senderImage" className="text-xs">
                Sender Image URL
              </Label>
              <Input
                id="senderImage"
                placeholder="https://..."
                value={action.sender?.imageUrl ?? ""}
                onChange={(e) =>
                  updateSender({ imageUrl: e.target.value || (null as any) })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-1.5">
          <Label className="text-xs">Position</Label>
          <Tabs
            value={action.position || "left"}
            onValueChange={(val: string) =>
              updateAction({ position: val as "left" | "right" })
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-8 p-1 bg-muted/50">
              <TabsTrigger value="left" className="text-[10px] h-6 flex gap-2">
                <AlignLeft className="h-3.5 w-3.5" />
                Left
              </TabsTrigger>
              <TabsTrigger value="right" className="text-[10px] h-6 flex gap-2">
                Right
                <AlignRight className="h-3.5 w-3.5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-1">
          <Label htmlFor="audioUrl" className="text-xs">
            Audio URL
          </Label>
          <Input
            id="audioUrl"
            placeholder="https://..."
            value={action.audioUrl ?? ""}
            onChange={(e) =>
              updateAction({ audioUrl: e.target.value || (null as any) })
            }
            className="h-8 text-xs"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-2 col-span-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="isDisplay"
              checked={action.isDisplay ?? true}
              onCheckedChange={(checked) =>
                updateAction({ isDisplay: checked })
              }
            />
            <Label htmlFor="isDisplay" className="text-xs cursor-pointer">
              Display Chat
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isReadable"
              checked={action.isReadable ?? true}
              onCheckedChange={(checked) =>
                updateAction({ isReadable: checked })
              }
            />
            <Label htmlFor="isReadable" className="text-xs cursor-pointer">
              Readable
            </Label>
          </div>
        </div>
      </div>

      {/* Rich Word Editor */}
      <div className="space-y-1">
        <Label className="text-xs font-semibold">Message Text</Label>
        <RichWordEditor
          words={action.text || []}
          onChange={(words) => updateAction({ text: words })}
        />
      </div>
    </div>
  );
}
