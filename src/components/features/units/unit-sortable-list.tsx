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
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";

interface UnitSortableListProps {
  title?: string;
  courseId: string;
  units: LocalUnit[];
  onReorder: (newUnits: LocalUnit[]) => void;
  onEdit: (unit: LocalUnit) => void;
  onDelete: (id: string) => void;
  addButton?: React.ReactNode;
}

const UNIT_FILTERS: FilterGroup[] = [
  {
    key: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    allowMultiple: true,
  },
];

export function UnitSortableList({
  title,
  courseId,
  units,
  onReorder,
  onEdit,
  onDelete,
  addButton,
}: UnitSortableListProps) {
  const [items, setItems] = useState<LocalUnit[]>(units);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [search, setSearch] = useState("");

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
    const statusValues = activeFilters["status"] || [];
    const matchesStatus =
      statusValues.length === 0 ||
      (statusValues.includes("active") && item.isActive) ||
      (statusValues.includes("inactive") && !item.isActive);

    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const isFiltered =
    Object.keys(activeFilters).some((k) => activeFilters[k]?.length > 0) ||
    search.length > 0;

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        filters={UNIT_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={displayedItems.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
          disabled={false}
        >
          <div className={cn("space-y-2")}>
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
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
