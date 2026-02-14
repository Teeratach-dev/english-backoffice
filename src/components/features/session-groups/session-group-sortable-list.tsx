"use client";

import React, { useState, useEffect } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSessionGroupItem } from "./sortable-session-group-item";
import { toast } from "sonner";
import { LocalSessionGroup } from "@/types/local.types";

interface SessionGroupSortableListProps {
  courseId: string;
  unitId: string;
  topicId: string;
  groups: LocalSessionGroup[];
  onReorder: (newGroups: LocalSessionGroup[]) => void;
  onEdit: (group: LocalSessionGroup) => void;
  onDelete: (id: string) => void;
}

export function SessionGroupSortableList({
  courseId,
  unitId,
  topicId,
  groups,
  onReorder,
  onEdit,
  onDelete,
}: SessionGroupSortableListProps) {
  const [items, setItems] = useState<LocalSessionGroup[]>(groups);

  useEffect(() => {
    setItems(groups);
  }, [groups]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder(newItems);

      try {
        const res = await fetch("/api/session-groups/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicId,
            groupIds: newItems.map((i) => i._id),
          }),
        });

        if (!res.ok) throw new Error("Failed to reorder groups");
        toast.success("Groups reordered");
      } catch (error) {
        toast.error("Error saving new order");
        setItems(groups); // Revert
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((group) => (
            <SortableSessionGroupItem
              key={group._id}
              group={group}
              courseId={courseId}
              unitId={unitId}
              topicId={topicId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
              No session groups found. Click "Add Group" to start.
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
