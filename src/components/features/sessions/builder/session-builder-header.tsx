"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

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
    <div className="max-w-3xl mx-auto mb-6">
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
        <div>
          <h1 className="text-lg font-bold">{sessionName}</h1>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            {sessionType} • Level {cefrLevel}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadTemplate}
            disabled={saving}
          >
            Load Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSaveTemplate}
            disabled={saving || !hasScreens}
          >
            Save as Template
          </Button>
          <div className="w-px h-8 bg-border mx-2" />
          <Button size="sm" onClick={onSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />{" "}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
