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
import { SortableTopicItem } from "./sortable-topic-item";
import { toast } from "sonner";

interface Topic {
  _id: string;
  name: string;
  isActive: boolean;
  sequence: number;
}

interface TopicSortableListProps {
  courseId: string;
  unitId: string;
  topics: Topic[];
  onReorder: (newTopics: Topic[]) => void;
  onEdit: (topic: Topic) => void;
  onDelete: (id: string) => void;
}

export function TopicSortableList({
  courseId,
  unitId,
  topics,
  onReorder,
  onEdit,
  onDelete,
}: TopicSortableListProps) {
  const [items, setItems] = useState<Topic[]>(topics);

  useEffect(() => {
    setItems(topics);
  }, [topics]);

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
        const res = await fetch("/api/topics/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitId,
            topicIds: newItems.map((i) => i._id),
          }),
        });

        if (!res.ok) throw new Error("Failed to reorder topics");
        toast.success("Topics reordered");
      } catch (error) {
        toast.error("Error saving new order");
        setItems(topics); // Revert
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
          {items.map((topic) => (
            <SortableTopicItem
              key={topic._id}
              topic={topic}
              courseId={courseId}
              unitId={unitId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
              No topics found. Click "Add Topic" to start.
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
