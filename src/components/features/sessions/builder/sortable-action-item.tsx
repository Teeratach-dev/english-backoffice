"use client";

import React, { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Volume2,
  Image as ImageIcon,
  MessageCircle,
  Info,
  Type,
  ListChecks,
  ArrowLeftRight,
  CreditCard,
  Keyboard,
  MousePointer2,
  PenTool,
  Columns2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Action, ActionType, ACTION_TYPE_LABELS } from "@/types/action.types";
import { SessionPreview } from "./session-preview";

const ACTION_ICONS: Record<ActionType, React.ReactNode> = {
  [ActionType.Explain]: <Info className="h-4 w-4" />,
  [ActionType.Reading]: <Type className="h-4 w-4" />,
  [ActionType.Audio]: <Volume2 className="h-4 w-4" />,
  [ActionType.Chat]: <MessageCircle className="h-4 w-4" />,
  [ActionType.Image]: <ImageIcon className="h-4 w-4" />,
  [ActionType.Column]: <Columns2 className="h-4 w-4" />,
  [ActionType.Choice]: <ListChecks className="h-4 w-4" />,
  [ActionType.Reorder]: <ArrowLeftRight className="h-4 w-4" />,
  [ActionType.MatchCard]: <CreditCard className="h-4 w-4" />,
  [ActionType.FillSentenceByTyping]: <Keyboard className="h-4 w-4" />,
  [ActionType.FillSentenceWithChoice]: <MousePointer2 className="h-4 w-4" />,
  [ActionType.WriteSentence]: <PenTool className="h-4 w-4" />,
  [ActionType.WriteSentenceInChat]: <MessageCircle className="h-4 w-4" />,
};

interface SortableActionItemProps {
  action: Action & { id: string };
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  index: number;
  showPreview: boolean;
}

export function SortableActionItem({
  action,
  isEditing,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  index,
  showPreview,
}: SortableActionItemProps) {
  const [internalShowPreview, setInternalShowPreview] = useState(showPreview);

  React.useEffect(() => {
    setInternalShowPreview(showPreview);
  }, [showPreview]);

  return (
    <div
      className={cn(
        "group/action relative flex flex-col gap-3 p-4 pt-6 border rounded-xl transition-all cursor-pointer shadow-md hover:shadow-xl bg-background hover:border-primary",
        isEditing ? "ring-2 ring-primary shadow-2xl" : "",
      )}
      onClick={onEdit}
    >
      <div className="absolute left-1/2 -top-4 -translate-x-1/2 flex gap-1 opacity-0 group-hover/action:opacity-100 transition-all z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background shadow-md hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp?.();
          }}
          disabled={isFirst}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background shadow-md hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown?.();
          }}
          disabled={isLast}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex  items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {ACTION_ICONS[action.type as ActionType]}
            </div>
            <h3 className="font-bold text-sm tracking-tight text-foreground">
              {ACTION_TYPE_LABELS[action.type as ActionType] || action.type}
            </h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
              #{index + 1}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 transition-colors",
              internalShowPreview
                ? "text-primary hover:bg-primary/10"
                : "text-muted-foreground hover:bg-muted",
            )}
            onClick={(e) => {
              e.stopPropagation();
              setInternalShowPreview(!internalShowPreview);
            }}
            title={internalShowPreview ? "Hide Preview" : "Show Preview"}
          >
            {internalShowPreview ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {internalShowPreview && <SessionPreview action={action} />}
    </div>
  );
}
