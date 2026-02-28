"use client";

import { Button } from "@/components/ui/button";
import {
  Plus,
  Smartphone,
  PenTool,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { Screen } from "@/types/action.types";

interface ScreensToolbarProps {
  screens: (Screen & { isCollapsed?: boolean })[];
  showPreview: boolean;
  onToggleAll: (collapse: boolean) => void;
  onTogglePreview: () => void;
  onAddScreen: () => void;
}

export function ScreensToolbar({
  screens,
  showPreview,
  onToggleAll,
  onTogglePreview,
  onAddScreen,
}: ScreensToolbarProps) {
  const someOpen = screens.some((s) => !s.isCollapsed);

  return (
    <div className="flex items-center mt-6 mb-4">
      <h2 className="text-xl font-semibold">Screens</h2>
      <div className="ml-auto">
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={() => onToggleAll(someOpen)}
          disabled={screens.length === 0}
        >
          {someOpen ? (
            <ChevronsUp className="h-4 w-4 mr-0 min-[550px]:mr-2" />
          ) : (
            <ChevronsDown className="h-4 w-4 mr-0 min-[550px]:mr-2" />
          )}
          <span className="hidden min-[550px]:inline">
            {someOpen ? "Collapse All" : "Expand All"}
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="mr-2 lg:hidden"
          onClick={onTogglePreview}
        >
          {showPreview ? (
            <PenTool className="h-4 w-4 mr-0 min-[550px]:mr-2" />
          ) : (
            <Smartphone className="h-4 w-4 mr-0 min-[550px]:mr-2" />
          )}
          <span className="hidden min-[550px]:inline">
            {showPreview ? "Editor Mode" : "Mobile View"}
          </span>
        </Button>
        <Button onClick={onAddScreen} size="sm">
          <Plus className="h-4 w-4 mr-0 min-[550px]:mr-2" />
          <span className="hidden min-[550px]:inline">Add Screen</span>
        </Button>
      </div>
    </div>
  );
}
