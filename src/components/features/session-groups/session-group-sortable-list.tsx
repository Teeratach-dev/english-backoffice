"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { arrayMove } from "@dnd-kit/sortable";
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

import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";

const GROUP_FILTERS: FilterGroup[] = [
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    setItems(groups);
  }, [groups]);

  async function handleMove(id: string, direction: "up" | "down") {
    const oldIndex = items.findIndex((i) => i._id === id);
    const newIndex = direction === "up" ? oldIndex - 1 : oldIndex + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

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
        filters={GROUP_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <div className={cn("space-y-2")}>
        {displayedItems.map((group, idx) => (
          <SortableSessionGroupItem
            key={group._id}
            group={group}
            courseId={courseId}
            unitId={unitId}
            topicId={topicId}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveUp={() => handleMove(group._id, "up")}
            onMoveDown={() => handleMove(group._id, "down")}
            isFirst={idx === 0}
            isLast={idx === displayedItems.length - 1}
          />
        ))}
        {displayedItems.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
            No session groups found. Click &apos;Add Group&apos; to start.
          </div>
        )}
      </div>
    </div>
  );
}
