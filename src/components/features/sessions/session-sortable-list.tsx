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
import { SortableSessionItem } from "./sortable-session-item";
import { toast } from "sonner";

interface Session {
  _id: string;
  name: string;
  type: string;
  cefrLevel: string;
  isActive: boolean;
  sequence: number;
}

interface SessionSortableListProps {
  courseId: string;
  unitId: string;
  topicId: string;
  groupId: string;
  sessions: Session[];
  onReorder: (newSessions: Session[]) => void;
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
}

export function SessionSortableList({
  courseId,
  unitId,
  topicId,
  groupId,
  sessions,
  onReorder,
  onEdit,
  onDelete,
}: SessionSortableListProps) {
  const [items, setItems] = useState<Session[]>(sessions);

  useEffect(() => {
    setItems(sessions);
  }, [sessions]);

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
        const res = await fetch("/api/sessions/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionGroupId: groupId,
            sessionIds: newItems.map((i) => i._id),
          }),
        });

        if (!res.ok) throw new Error("Failed to reorder sessions");
        toast.success("Sessions reordered");
      } catch (error) {
        toast.error("Error saving new order");
        setItems(sessions); // Revert
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
          {items.map((session) => (
            <SortableSessionItem
              key={session._id}
              session={session}
              courseId={courseId}
              unitId={unitId}
              topicId={topicId}
              groupId={groupId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
              No sessions found. Click "Add Session" to start.
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
