"use client";

import {
  Action,
  ActionType,
  ExplainAction,
  ReadingAction,
  ChatAction,
  ImageAction,
} from "@/types/action.types";
import { ImageIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExplainPreview } from "./previews/explain-preview";
import { ReadingPreview } from "./previews/reading-preview";
import { ChatPreview } from "./previews/chat-preview";
import { ImagePreview } from "./previews/image-preview";

interface SessionPreviewProps {
  action: Action | null;
}

export function SessionPreview({ action }: SessionPreviewProps) {
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
        return <ExplainPreview action={action as ExplainAction} />;

      case ActionType.Reading:
        return <ReadingPreview action={action as ReadingAction} />;

      case ActionType.Chat:
        return <ChatPreview action={action as ChatAction} />;

      case ActionType.Image:
        return <ImagePreview action={action as ImageAction} />;

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
        <div className="absolute -inset-4 bg-linear-to-r from-primary/5 to-purple-500/5 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative">{renderPreview()}</div>
      </div>
    </div>
  );
}
