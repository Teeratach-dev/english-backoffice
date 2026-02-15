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
import { SortableSessionGroupItem } from "./sortable-session-group-item";
import { toast } from "sonner";
import { LocalSessionGroup } from "@/types/local.types";

interface SessionGroupSortableListProps {
  title?: string;
  courseId: string;
  unitId: string;
  topicId: string;
  groups: LocalSessionGroup[];
  onReorder: (newGroups: LocalSessionGroup[]) => void;
  onEdit: (group: LocalSessionGroup) => void;
  onDelete: (id: string) => void;
  addButton?: React.ReactNode;
}

export function SessionGroupSortableList({
  title,
  courseId,
  unitId,
  topicId,
  groups,
  onReorder,
  onEdit,
  onDelete,
  addButton,
}: SessionGroupSortableListProps) {
  const [items, setItems] = useState<LocalSessionGroup[]>(groups);
  const [statusFilter, setStatusFilter] = useState("all");

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
            {displayedItems.map((group) => (
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
            {displayedItems.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                {isFiltered
                  ? "No session groups match the filter."
                  : "No session groups found. Click 'Add Group' to start."}
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
