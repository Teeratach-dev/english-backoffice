"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionContentEditor } from "./action-content-editor";
import { Action, ActionType, ACTION_TYPE_LABELS } from "@/types/action.types";

interface SessionBuilderSidebarProps {
  activeAction: (Action & { id: string }) | null;
  activeActionId: string | null;
  onClose: () => void;
  onUpdateAction: (actionId: string, updates: Partial<Action>) => void;
}

export function SessionBuilderSidebar({
  activeAction,
  activeActionId,
  onClose,
  onUpdateAction,
}: SessionBuilderSidebarProps) {
  return (
    <div
      className={cn(
        "w-[450px] border-l bg-background shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
        activeActionId
          ? "translate-x-0"
          : "translate-x-full fixed right-0 h-full",
      )}
    >
      {activeAction ? (
        <>
          <div className="p-4 border-b flex items-center justify-between bg-muted/10">
            <div>
              <h3 className="font-bold">
                {ACTION_TYPE_LABELS[activeAction.type as ActionType]}
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase">
                Configure Action Content
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Plus className="h-4 w-4 rotate-45" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-6">
            <ActionContentEditor
              action={activeAction}
              onChange={(updates) =>
                onUpdateAction(activeAction.id, updates)
              }
            />
            <div className="h-10" />
          </ScrollArea>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10 text-center">
          <Settings className="h-10 w-10 mb-4 opacity-20" />
          <p className="text-sm">
            Select an action to configure its properties
          </p>
        </div>
      )}
    </div>
  );
}
