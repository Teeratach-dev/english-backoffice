import React, { useState } from "react";
import {
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { arrayMove } from "@dnd-kit/sortable";
import { Screen, ActionType, ACTION_TYPE_LABELS } from "@/types/action.types";
import { SortableActionItem } from "./sortable-action-item";
import { ActionTypeSelector } from "./action-type-selector";
import { ActionContentEditor } from "./action-content-editor";
import { PhonePreview } from "./phone-preview";
import {
  Volume2,
  Image as ImageIcon,
  MessageCircle,
  Info,
  Type,
  ListChecks,
  ArrowLeftRight,
  CreditCard,
  Keyboard,
  MousePointer2,
  PenTool,
  Columns2,
} from "lucide-react";

const ACTION_ICONS: Record<ActionType, React.ReactNode> = {
  [ActionType.Explain]: <Info className="h-4 w-4" />,
  [ActionType.Reading]: <Type className="h-4 w-4" />,
  [ActionType.Audio]: <Volume2 className="h-4 w-4" />,
  [ActionType.Chat]: <MessageCircle className="h-4 w-4" />,
  [ActionType.Image]: <ImageIcon className="h-4 w-4" />,
  [ActionType.Column]: <Columns2 className="h-4 w-4" />,
  [ActionType.Choice]: <ListChecks className="h-4 w-4" />,
  [ActionType.Reorder]: <ArrowLeftRight className="h-4 w-4" />,
  [ActionType.MatchCard]: <CreditCard className="h-4 w-4" />,
  [ActionType.FillSentenceByTyping]: <Keyboard className="h-4 w-4" />,
  [ActionType.FillSentenceWithChoice]: <MousePointer2 className="h-4 w-4" />,
  [ActionType.WriteSentence]: <PenTool className="h-4 w-4" />,
  [ActionType.WriteSentenceInChat]: <MessageCircle className="h-4 w-4" />,
};

interface SortableScreenCardProps {
  screen: Screen;
  sIdx: number;
  activeActionId: string | null;
  onDelete: () => void;
  onAddAction: (type: ActionType) => void;
  onDeleteAction: (id: string) => void;
  onReorderActions: (id: string, overId: string) => void;
  onEditAction: (actionId: string) => void;
  onUpdateAction: (actionId: string, updates: any) => void;
  showPreview: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  screenNumber: number;
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
}

export function SortableScreenCard({
  screen,
  sIdx,
  activeActionId,
  onDelete,
  onAddAction,
  onDeleteAction,
  onReorderActions,
  onEditAction,
  onUpdateAction,
  showPreview,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  screenNumber,
  isCollapsed,
  onToggleCollapse,
}: SortableScreenCardProps) {
  const [isActionSelectorOpen, setIsActionSelectorOpen] = useState(false);

  const activeActionInScreen = screen.actions.find(
    (a) => a.id === activeActionId,
  );

  function handleMoveAction(actionId: string, direction: "up" | "down") {
    const oldIndex = screen.actions.findIndex((a) => a.id === actionId);
    const newIndex = direction === "up" ? oldIndex - 1 : oldIndex + 1;

    if (newIndex < 0 || newIndex >= screen.actions.length) return;

    const newActions = arrayMove(screen.actions, oldIndex, newIndex);
    // Since screen actions are passed from parent, we should use onReorderActions to inform parent
    onReorderActions(actionId, screen.actions[newIndex].id);
  }

  return (
    <div className="relative">
      <Card className="relative group overflow-visible">
        <CardHeader className="py-2 px-4  bg-muted/5 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-xxs font-bold">
              {screenNumber}
            </span>
            Screen {screenNumber}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background/90"
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background/90"
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background/90 ml-2"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8  hover:bg-background/90 shadow-sm"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        {!isCollapsed && (
          <CardContent className="px-4 space-y-2">
            <>
              <div className="flex flex-col gap-2">
                {screen.actions.map((action, idx) => (
                  <React.Fragment key={action.id}>
                    <SortableActionItem
                      action={action}
                      index={idx}
                      isEditing={activeActionId === action.id}
                      onEdit={() =>
                        onEditAction(
                          activeActionId === action.id ? "" : action.id,
                        )
                      }
                      onDelete={() => onDeleteAction(action.id)}
                      onMoveUp={() => handleMoveAction(action.id, "up")}
                      onMoveDown={() => handleMoveAction(action.id, "down")}
                      isFirst={idx === 0}
                      isLast={idx === screen.actions.length - 1}
                      showPreview={showPreview}
                    />
                    {activeActionInScreen &&
                      activeActionInScreen.id === action.id && (
                        <Card className="border-primary/20 shadow-md animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden ring-1 ring-primary/5">
                          <CardHeader className="py-2.5 px-4 bg-primary/5 border-b flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                              <div className="relative">
                                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                                <span className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
                              </div>
                              {
                                ACTION_TYPE_LABELS[
                                  activeActionInScreen.type as ActionType
                                ]
                              }{" "}
                              Editor
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xxs hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => onEditAction("")}
                            >
                              Close Editor
                            </Button>
                          </CardHeader>
                          <CardContent className="p-4 lg:p-6">
                            <ActionContentEditor
                              action={activeActionInScreen}
                              onChange={(updates) =>
                                onUpdateAction(activeActionInScreen.id, updates)
                              }
                            />
                          </CardContent>
                        </Card>
                      )}
                  </React.Fragment>
                ))}
              </div>

              {!showPreview && (
                <Button
                  variant="outline"
                  className="w-full border-dashed py-6 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                  onClick={() => setIsActionSelectorOpen(true)}
                >
                  <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Add Action</span>
                </Button>
              )}
            </>
          </CardContent>
        )}
      </Card>

      <ActionTypeSelector
        open={isActionSelectorOpen}
        onOpenChange={setIsActionSelectorOpen}
        onSelect={(type) => onAddAction(type)}
      />
    </div>
  );
}
