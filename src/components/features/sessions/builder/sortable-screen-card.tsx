"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Screen, ActionType, ACTION_TYPE_VALUES, ACTION_TYPE_LABELS } from "@/types/action.types";
import { SortableActionItem } from "./sortable-action-item";

interface SortableScreenCardProps {
  screen: Screen;
  sIdx: number;
  activeActionId: string | null;
  onDelete: () => void;
  onAddAction: (type: ActionType) => void;
  onDeleteAction: (id: string) => void;
  onReorderActions: (id: string, overId: string) => void;
  onEditAction: (actionId: string) => void;
}

export function SortableScreenCard({
  screen,
  sIdx,
  activeActionId,
  onDelete,
  onAddAction,
  onDeleteAction,
  onReorderActions,
  onEditAction,
}: SortableScreenCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screen.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleActionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onReorderActions(active.id as string, over?.id as string);
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className="relative group overflow-visible">
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-10 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity p-2"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-xs">
              {sIdx + 1}
            </span>
            Screen {sIdx + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b">
            {ACTION_TYPE_VALUES.map((at) => (
              <Button
                key={at}
                variant="outline"
                size="sm"
                className="h-7 text-[10px] px-2 bg-background/50 hover:bg-background"
                onClick={() => onAddAction(at as ActionType)}
              >
                <Plus className="h-2 w-2 mr-1" />{" "}
                {ACTION_TYPE_LABELS[at as ActionType]}
              </Button>
            ))}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleActionDragEnd}
          >
            <SortableContext
              items={screen.actions.map((a) => a.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-2 p-3 min-h-[60px] bg-muted/20 rounded-lg border-2 border-dashed">
                {screen.actions.map((action) => (
                  <SortableActionItem
                    key={action.id}
                    action={action}
                    isEditing={activeActionId === action.id}
                    onEdit={() => onEditAction(action.id)}
                    onDelete={() => onDeleteAction(action.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
