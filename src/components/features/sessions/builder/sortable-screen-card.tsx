import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus } from "lucide-react";
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
import {
  Screen,
  ActionType,
  ACTION_TYPE_VALUES,
  ACTION_TYPE_LABELS,
} from "@/types/action.types";
import { SortableActionItem } from "./sortable-action-item";
import { ActionTypeSelector } from "./action-type-selector";

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
  const [isActionSelectorOpen, setIsActionSelectorOpen] = useState(false);

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
          className="absolute left-1 top-2 lg:-left-10 lg:top-1/2 lg:-translate-y-1/2 cursor-grab opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-2 z-10"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <CardHeader className="py-2 pl-10 lg:pl-6 border-b bg-muted/5">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-[10px] font-bold">
              {sIdx + 1}
            </span>
            Screen {sIdx + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleActionDragEnd}
          >
            <SortableContext
              items={screen.actions.map((a) => a.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-2 min-h-25 p-2 bg-muted/10 rounded-xl border-2 border-dashed border-muted transition-colors hover:border-muted-foreground/20">
                {screen.actions.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-xs">No actions added yet</p>
                  </div>
                ) : (
                  screen.actions.map((action) => (
                    <SortableActionItem
                      key={action.id}
                      action={action}
                      isEditing={activeActionId === action.id}
                      onEdit={() => onEditAction(action.id)}
                      onDelete={() => onDeleteAction(action.id)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>

          <Button
            variant="outline"
            className="w-full border-dashed py-6 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all group"
            onClick={() => setIsActionSelectorOpen(true)}
          >
            <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Add Action</span>
          </Button>
        </CardContent>
      </Card>

      <ActionTypeSelector
        open={isActionSelectorOpen}
        onOpenChange={setIsActionSelectorOpen}
        onSelect={(type) => onAddAction(type)}
      />
    </div>
  );
}
