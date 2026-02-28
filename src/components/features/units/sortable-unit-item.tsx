"use client";

import { ChevronUp, ChevronDown, Edit, Trash2, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { LocalUnit } from "@/types/local.types";

export function SortableUnitItem({
  unit,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  unit: LocalUnit;
  onEdit: (unit: LocalUnit) => void;
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
        <h4 className="font-medium truncate">{unit.name}</h4>
        {unit.courseName && (
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            Course: {unit.courseName}
          </p>
        )}
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            unit.isActive
              ? "bg-success text-success-foreground"
              : "bg-error text-error-foreground"
          }`}
        >
          {unit.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/units/${unit._id}`}>
            <PenTool className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(unit)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(unit._id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
