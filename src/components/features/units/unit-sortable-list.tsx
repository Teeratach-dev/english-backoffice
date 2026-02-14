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
import { SortableUnitItem } from "./sortable-unit-item";
import { toast } from "sonner";

interface Unit {
  _id: string;
  name: string;
  isActive: boolean;
  sequence: number;
}

interface UnitSortableListProps {
  courseId: string;
  units: Unit[];
  onReorder: (newUnits: Unit[]) => void;
  onEdit: (unit: Unit) => void;
  onDelete: (id: string) => void;
}

export function UnitSortableList({
  courseId,
  units,
  onReorder,
  onEdit,
  onDelete,
}: UnitSortableListProps) {
  const [items, setItems] = useState<Unit[]>(units);

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
          {items.map((unit) => (
            <SortableUnitItem
              key={unit._id}
              unit={unit}
              courseId={courseId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
              No units found. Click "Add Unit" to start.
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
