"use client";

import React, { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripHorizontal,
  Settings,
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
  index: number;
  showPreview: boolean;
}

export function SortableActionItem({
  action,
  isEditing,
  onEdit,
  onDelete,
  index,
  showPreview,
}: SortableActionItemProps) {
  const [internalShowPreview, setInternalShowPreview] = useState(showPreview);

  React.useEffect(() => {
    setInternalShowPreview(showPreview);
  }, [showPreview]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/action relative flex flex-col gap-3 p-4 pt-6 border rounded-xl transition-all cursor-pointer shadow-md hover:shadow-xl bg-background hover:border-primary",
        isEditing ? "ring-2 ring-primary shadow-2xl" : "",
      )}
      onClick={onEdit}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1/2 -top-3 -translate-x-1/2 cursor-grab opacity-0 group-hover/action:opacity-100 transition-opacity p-1 z-10 bg-background border rounded-md shadow-sm hover:ring-2 hover:ring-primary/20"
      >
        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
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
