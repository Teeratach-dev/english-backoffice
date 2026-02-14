"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Session {
  _id: string;
  name: string;
  type: string;
  cefrLevel: string;
  isActive: boolean;
}

export function SortableSessionItem({
  session,
  courseId,
  unitId,
  topicId,
  groupId,
  onEdit,
  onDelete,
}: {
  session: Session;
  courseId: string;
  unitId: string;
  topicId: string;
  groupId: string;
  onEdit: (session: Session) => void;
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
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1">
        <h4 className="font-medium">{session.name}</h4>
        <div className="flex gap-2 mt-1">
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
            {session.type}
          </span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
            {session.cefrLevel}
          </span>
          <span
            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
              session.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {session.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/dashboard/courses/${courseId}/units/${unitId}/topics/${topicId}/groups/${groupId}/sessions/${session._id}/builder`}
          >
            <PenTool className="h-4 w-4 mr-2" /> Builder
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
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
