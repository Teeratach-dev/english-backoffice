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
import { SortableUnitItem } from "./sortable-unit-item";
import { toast } from "sonner";
import { LocalUnit } from "@/types/local.types";

interface UnitSortableListProps {
  courseId: string;
  units: LocalUnit[];
  onReorder: (newUnits: LocalUnit[]) => void;
  onEdit: (unit: LocalUnit) => void;
  onDelete: (id: string) => void;
}

export function UnitSortableList({
  courseId,
  units,
  onReorder,
  onEdit,
  onDelete,
}: UnitSortableListProps) {
  const [items, setItems] = useState<LocalUnit[]>(units);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setItems(units);
  }, [units]);

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
        const res = await fetch("/api/units/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            unitIds: newItems.map((i) => i._id),
          }),
        });

        if (!res.ok) throw new Error("Failed to reorder units");
        toast.success("Units reordered");
      } catch (error) {
        toast.error("Error saving new order");
        setItems(units); // Revert on failure
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
      <div className="flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
            {displayedItems.map((unit) => (
              <SortableUnitItem
                key={unit._id}
                unit={unit}
                courseId={courseId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {displayedItems.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                {isFiltered
                  ? "No units match the filter."
                  : "No units found. Click 'Add Unit' to start."}
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
