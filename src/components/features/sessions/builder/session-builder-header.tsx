"use client";

import { Button } from "@/components/ui/button";
import { FolderOpen, Save as SaveIcon } from "lucide-react";

interface SessionBuilderHeaderProps {
  courseId: string;
  unitId: string;
  topicId: string;
  groupId: string;
  sessionName: string;
  sessionType: string;
  cefrLevel: string;
  saving: boolean;
  onSave: () => void;
  onLoadTemplate: () => void;
  onOpenSaveTemplate: () => void;
  hasScreens: boolean;
}

export function SessionBuilderHeader({
  courseId,
  unitId,
  topicId,
  groupId,
  sessionName,
  sessionType,
  cefrLevel,
  saving,
  onSave,
  onLoadTemplate,
  onOpenSaveTemplate,
  hasScreens,
}: SessionBuilderHeaderProps) {
  return (
    <div className="w-full mb-4">
      <div className="flex flex-row items-center gap-4 p-2 max-[550px]:p-2">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{sessionName}</h1>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest truncate">
            {sessionType} • Level {cefrLevel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadTemplate}
            disabled={saving}
            className="flex items-center gap-2 h-9 px-3 lg:px-4"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Load Template</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSaveTemplate}
            disabled={saving || !hasScreens}
            className="flex items-center gap-2 h-9 px-3 lg:px-4"
          >
            <SaveIcon className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Save as Template</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
