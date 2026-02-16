"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { arrayMove } from "@dnd-kit/sortable";
import { SortableTopicItem } from "./sortable-topic-item";
import { toast } from "sonner";
import { LocalTopic } from "@/types/local.types";

interface TopicSortableListProps {
  title?: string;
  courseId: string;
  unitId: string;
  topics: LocalTopic[];
  onReorder: (newTopics: LocalTopic[]) => void;
  onEdit: (topic: LocalTopic) => void;
  onDelete: (id: string) => void;
  addButton?: React.ReactNode;
}

import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";

const TOPIC_FILTERS: FilterGroup[] = [
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

export function TopicSortableList({
  title,
  courseId,
  unitId,
  topics,
  onReorder,
  onEdit,
  onDelete,
  addButton,
}: TopicSortableListProps) {
  const [items, setItems] = useState<LocalTopic[]>(topics);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    setItems(topics);
  }, [topics]);

  async function handleMove(id: string, direction: "up" | "down") {
    const oldIndex = items.findIndex((i) => i._id === id);
    const newIndex = direction === "up" ? oldIndex - 1 : oldIndex + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

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
        filters={TOPIC_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <div className={cn("space-y-2")}>
        {displayedItems.map((topic, idx) => (
          <SortableTopicItem
            key={topic._id}
            topic={topic}
            courseId={courseId}
            unitId={unitId}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveUp={() => handleMove(topic._id, "up")}
            onMoveDown={() => handleMove(topic._id, "down")}
            isFirst={idx === 0}
            isLast={idx === displayedItems.length - 1}
          />
        ))}
        {displayedItems.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
            No topics found. Click &apos;Add Topic&apos; to start.
          </div>
        )}
      </div>
    </div>
  );
}
