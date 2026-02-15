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
  ChoiceAction,
  ReorderAction,
  MatchCardAction,
  FillSentenceByTypingAction,
  FillSentenceWithChoiceAction,
} from "@/types/action.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { Plus, Trash2 } from "lucide-react";

import { ReadingActionForm } from "./forms/reading-action-form";
import { ExplainActionForm } from "./forms/explain-action-form";
import { AudioActionForm } from "./forms/audio-action-form";
import { ChatActionForm } from "./forms/chat-action-form";
import { ImageActionForm } from "./forms/image-action-form";
import { ColumnActionForm } from "./forms/column-action-form";
import { ChoiceActionForm } from "./forms/choice-action-form";
import { ReorderActionForm } from "./forms/reorder-action-form";
import { MatchCardActionForm } from "./forms/match-card-action-form";
import { FillSentenceByTypingActionForm } from "./forms/fill-sentence-by-typing-action-form";
import { FillSentenceWithChoiceActionForm } from "./forms/fill-sentence-by-choice-action-form";

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
        <ChoiceActionForm
          action={action}
          onChange={(updates: Partial<ChoiceAction>) => updateAction(updates)}
        />
      );

    case ActionType.Reorder:
      return (
        <ReorderActionForm
          action={action}
          onChange={(updates: Partial<ReorderAction>) => updateAction(updates)}
        />
      );

    case ActionType.MatchCard:
      return (
        <MatchCardActionForm
          action={action as MatchCardAction}
          onChange={(updates: Partial<MatchCardAction>) =>
            updateAction(updates)
          }
        />
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
      return (
        <FillSentenceByTypingActionForm
          action={action as FillSentenceByTypingAction}
          onChange={(updates: Partial<FillSentenceByTypingAction>) =>
            updateAction(updates)
          }
        />
      );

    case ActionType.FillSentenceWithChoice:
      return (
        <FillSentenceWithChoiceActionForm
          action={action as FillSentenceWithChoiceAction}
          onChange={(updates: Partial<FillSentenceWithChoiceAction>) =>
            updateAction(updates)
          }
        />
      );

    default:
      return (
        <div className="text-center py-4 text-xs text-muted-foreground italic border border-dashed rounded bg-muted/10">
          Form for {action.type} is not yet implemented.
        </div>
      );
  }
}
