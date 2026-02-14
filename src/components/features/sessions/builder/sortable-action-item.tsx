"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Settings, Trash } from "lucide-react";
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
        "flex items-center border rounded px-3 py-2 shadow-sm relative group/action transition-colors",
        isEditing ? "bg-primary/5 border-primary shadow-md" : "bg-background",
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab mr-2">
        <GripHorizontal className="h-3 w-3 text-muted-foreground" />
      </div>
      <span
        className="text-xs font-semibold mr-2 cursor-pointer"
        onClick={onEdit}
      >
        {ACTION_TYPE_LABELS[action.type as ActionType] || action.type}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover/action:opacity-100 transition-opacity ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onEdit}
        >
          <Settings className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive"
          onClick={onDelete}
        >
          <Trash className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
