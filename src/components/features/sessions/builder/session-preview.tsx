"use client";

import {
  Action,
  ActionType,
  ExplainAction,
  ReadingAction,
  ChatAction,
  ImageAction,
  AudioAction,
  ColumnAction,
  ChoiceAction,
} from "@/types/action.types";
import { ImageIcon, Info } from "lucide-react";
import { ExplainPreview } from "./previews/explain-preview";
import { ReadingPreview } from "./previews/reading-preview";
import { ChatPreview } from "./previews/chat-preview";
import { ImagePreview } from "./previews/image-preview";
import { AudioPreview } from "./previews/audio-preview";
import { ColumnPreview } from "./previews/column-preview";
import { ChoicePreview } from "./previews/choice-preview";
import { ReorderPreview } from "./previews/reorder-preview";
import { MatchCardPreview } from "./previews/match-card-preview";
import { FillSentenceByTypingPreview } from "./previews/fill-sentence-by-typing-preview";
import { FillSentenceByChoicePreview } from "./previews/fill-sentence-by-choice-preview";
import { WriteSentencePreview } from "./previews/write-sentence-preview";
import { WriteSentenceInChatPreview } from "./previews/write-sentence-in-chat-preview";

interface SessionPreviewProps {
  action: Action | null;
  isShowShadow?: boolean;
  isHoverEffect?: boolean;
}

export function SessionPreview({
  action,
  isShowShadow = true,
  isHoverEffect = true,
}: SessionPreviewProps) {
  if (!action) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 text-center px-10">
        <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted">
          <ImageIcon className="h-8 w-8 opacity-20" />
        </div>
        <div>
          <p className="font-bold text-sm text-foreground">
            No Action Selected
          </p>
          <p className="text-xs">
            Select an action to see its live preview here
          </p>
        </div>
      </div>
    );
  }

  function renderPreview() {
    if (!action) return null;

    switch (action.type) {
      case ActionType.Explain:
        return (
          <ExplainPreview
            action={action as ExplainAction}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.Reading:
        return (
          <ReadingPreview
            action={action as ReadingAction}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.Audio:
        return (
          <AudioPreview
            action={action as AudioAction}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.Chat:
        return (
          <ChatPreview
            action={action as ChatAction}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.Image:
        return (
          <ImagePreview
            action={action as ImageAction}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.Column:
        return (
          <ColumnPreview
            action={action as ColumnAction}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.Choice:
        return (
          <ChoicePreview
            action={action as ChoiceAction}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.Reorder:
        return <ReorderPreview action={action} isShowShadow={isShowShadow} />;

      case ActionType.MatchCard:
        return (
          <MatchCardPreview
            action={action as any}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.FillSentenceByTyping:
        return (
          <FillSentenceByTypingPreview
            action={action as any}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.FillSentenceWithChoice:
        return (
          <FillSentenceByChoicePreview
            action={action as any}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.WriteSentence:
        return (
          <WriteSentencePreview
            action={action as any}
            isShowShadow={isShowShadow}
          />
        );

      case ActionType.WriteSentenceInChat:
        return (
          <WriteSentenceInChatPreview
            action={action as any}
            isShowShadow={isShowShadow}
          />
        );

      default:
        return (
          <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground text-center space-y-3 bg-muted/5">
            <div className="p-3 bg-muted rounded-full">
              <Info className="h-6 w-6 opacity-40" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                {action.type} Preview
              </p>
              <p className="text-[10px] italic">
                Live preview for this type is coming soon
              </p>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="animate-in fade-in zoom-in duration-500 w-full">
      <div className="relative group">
        {isHoverEffect && (
          <div className="absolute -inset-4 bg-linear-to-r from-primary/5 to-purple-500/5 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        )}
        <div className="relative">{renderPreview()}</div>
      </div>
    </div>
  );
}
