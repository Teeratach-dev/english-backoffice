"use client";

import React from "react";
import { ChevronUp, ChevronDown, Edit, Trash2, PenTool } from "lucide-react";
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
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  session: LocalSession;
  courseId: string;
  unitId: string;
  topicId: string;
  groupId: string;
  onEdit: (session: LocalSession) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-card shadow-sm mb-2">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
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
