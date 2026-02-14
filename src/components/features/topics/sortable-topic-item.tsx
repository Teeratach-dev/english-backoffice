"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { LocalTopic } from "@/types/local.types";

export function SortableTopicItem({
  topic,
  courseId,
  unitId,
  onEdit,
  onDelete,
}: {
  topic: LocalTopic;
  courseId: string;
  unitId: string;
  onEdit: (topic: LocalTopic) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 border rounded-lg bg-card shadow-sm mb-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1">
        <h4 className="font-medium">{topic.name}</h4>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            topic.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {topic.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/dashboard/courses/${courseId}/units/${unitId}/topics/${topic._id}/groups`}
          >
            <FolderOpen className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(topic)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(topic._id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
