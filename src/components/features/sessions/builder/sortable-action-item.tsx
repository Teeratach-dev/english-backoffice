"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Action, ActionType, ACTION_TYPE_LABELS } from "@/types/action.types";

interface SortableActionItemProps {
  action: Action & { id: string };
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableActionItem({
  action,
  isEditing,
  onEdit,
  onDelete,
}: SortableActionItemProps) {
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
        "flex items-center gap-3 border rounded-xl px-4 py-3 shadow-sm relative group/action transition-all w-full",
        isEditing
          ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/20"
          : "bg-background hover:border-primary/30 hover:shadow-md",
      )}
      onClick={onEdit}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 hover:bg-muted rounded transition-colors group-hover/action:text-primary"
      >
        <GripHorizontal className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <div className="flex-1 min-w-0" onClick={onEdit}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">
            {ACTION_TYPE_LABELS[action.type as ActionType] || action.type}
          </span>
          {action.type === "explain" && (action as any).text?.length > 0 && (
            <span className="text-[10px] text-muted-foreground truncate opacity-60">
              - {(action as any).text.map((w: any) => w.text).join(" ")}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
