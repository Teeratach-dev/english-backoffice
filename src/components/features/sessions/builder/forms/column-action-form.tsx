"use client";

import {
  ColumnAction,
  ActionType,
  ImageAction,
  ReadingAction,
  AudioAction,
} from "@/types/action.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageActionForm } from "./image-action-form";
import { ReadingActionForm } from "./reading-action-form";
import { AudioActionForm } from "./audio-action-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

interface ColumnActionFormProps {
  action: ColumnAction;
  onChange: (updates: Partial<ColumnAction>) => void;
}

export function ColumnActionForm({ action, onChange }: ColumnActionFormProps) {
  const actions = action.actions || [];

  function handleAddAction(type: "image" | "reading" | "audio") {
    let newAction: ImageAction | ReadingAction | AudioAction;

    switch (type) {
      case "image":
        newAction = { type: ActionType.Image, url: "" };
        break;
      case "reading":
        newAction = {
          type: ActionType.Reading,
          text: [],
          isHide: false,
          isReadable: true,
        };
        break;
      case "audio":
        newAction = { type: ActionType.Audio, audio: "" };
        break;
    }

    const newActions = [...actions, newAction];
    onChange({ actions: newActions });
  }

  function handleRemoveAction(index: number) {
    const newActions = actions.filter((_, i) => i !== index);
    onChange({ actions: newActions });
  }

  function handleUpdateAction(
    index: number,
    updates: Partial<ImageAction | ReadingAction | AudioAction>,
  ) {
    const newActions = actions.map((item, i) => {
      if (i === index) {
        return { ...item, ...updates } as any;
      }
      return item;
    });
    onChange({ actions: newActions });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {actions.length < 2 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleAddAction(ActionType.Image as "image")}
              >
                Image
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddAction(ActionType.Reading as "reading")}
              >
                Reading
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddAction(ActionType.Audio as "audio")}
              >
                Audio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="space-y-3">
        {actions.map((subAction, index) => (
          <div key={`${subAction.type}-${index}`} className="relative group">
            <div className="flex flex-row justify-between items-center">
              <div className="rounded text-xxs text-muted-foreground uppercase tracking-wider font-medium">
                Column {index + 1} • {subAction.type}
              </div>
              <div className="group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground/40 hover:text-primary"
                  onClick={() => handleRemoveAction(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-0 pb-2">
              {subAction.type === ActionType.Image && (
                <ImageActionForm
                  action={subAction as ImageAction}
                  onChange={(updates) => handleUpdateAction(index, updates)}
                />
              )}
              {subAction.type === ActionType.Reading && (
                <ReadingActionForm
                  action={subAction as ReadingAction}
                  onChange={(updates) => handleUpdateAction(index, updates)}
                />
              )}
              {subAction.type === ActionType.Audio && (
                <AudioActionForm
                  action={subAction as AudioAction}
                  onChange={(updates) => handleUpdateAction(index, updates)}
                />
              )}
            </div>
          </div>
        ))}

        {actions.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            No items in this column. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
