"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash2, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { LocalSession } from "@/types/local.types";

export function SortableSessionItem({
  session,
  courseId,
  unitId,
  topicId,
  groupId,
  onEdit,
  onDelete,
}: {
  session: LocalSession;
  courseId: string;
  unitId: string;
  topicId: string;
  groupId: string;
  onEdit: (session: LocalSession) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session._id });

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
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{session.name}</h4>
        {session.sessionGroupName && (
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            Group: {session.sessionGroupName}
          </p>
        )}
        <div className="flex gap-2 mt-1">
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-info text-info-foreground">
            {session.type}
          </span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-warning text-warning-foreground">
            {session.cefrLevel}
          </span>
          <span
            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
              session.isActive
                ? "bg-success text-success-foreground"
                : "bg-error text-error-foreground"
            }`}
          >
            {session.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/courses/${courseId}/units/${unitId}/topics/${topicId}/groups/${groupId}/sessions/${session._id}/builder`}
            title="Builder"
          >
            <PenTool className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(session)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(session._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
