"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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
import { LocalSession } from "@/types/local.types";

interface SessionSortableListProps {
  title?: string;
  courseId: string;
  unitId: string;
  topicId: string;
  groupId: string;
  sessions: LocalSession[];
  onReorder: (newSessions: LocalSession[]) => void;
  onEdit: (session: LocalSession) => void;
  onDelete: (id: string) => void;
  addButton?: React.ReactNode;
}

export function SessionSortableList({
  title,
  courseId,
  unitId,
  topicId,
  groupId,
  sessions,
  onReorder,
  onEdit,
  onDelete,
  addButton,
}: SessionSortableListProps) {
  const [items, setItems] = useState<LocalSession[]>(sessions);
  const [statusFilter, setStatusFilter] = useState("all");

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

  const displayedItems = items.filter((item) => {
    if (statusFilter === "all") return true;
    return statusFilter === "active" ? item.isActive : !item.isActive;
  });

  const isFiltered = statusFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className="ml-auto flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-36 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {addButton}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={displayedItems.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
          disabled={isFiltered}
        >
          <div
            className={cn(
              "space-y-2",
              isFiltered && "opacity-80 grayscale-[0.2]",
            )}
          >
            {displayedItems.map((session) => (
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
            {displayedItems.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                {isFiltered
                  ? "No sessions match the filter."
                  : "No sessions found. Click 'Add Session' to start."}
              </div>
            )}
            {isFiltered && (
              <p className="text-xs text-muted-foreground italic text-center">
                Manual reordering is disabled while filtering.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
