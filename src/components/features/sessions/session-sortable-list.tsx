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

import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";

const SESSION_FILTERS: FilterGroup[] = [
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [search, setSearch] = useState("");

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
        filters={SESSION_FILTERS}
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
                No sessions found. Click &apos;Add Session&apos; to start.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
