import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
}: SortableScreenCardProps) {
  const [isActionSelectorOpen, setIsActionSelectorOpen] = useState(false);

  const activeActionInScreen = screen.actions.find(
    (a) => a.id === activeActionId,
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screen.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleActionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onReorderActions(active.id as string, over?.id as string);
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className="relative group overflow-visible">
        <div
          {...attributes}
          {...listeners}
          className="absolute left-1/2 -top-3 -translate-x-1/2 cursor-grab opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-1 z-10 bg-background border rounded-md shadow-sm"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground rotate-90" />
        </div>

        <CardHeader className="py-2 px-4  bg-muted/5 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-[10px] font-bold">
              {sIdx + 1}
            </span>
            Screen {sIdx + 1}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8  hover:bg-background/90 shadow-sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-4 space-y-2">
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleActionDragEnd}
            >
              {showPreview ? (
                <PhonePreview actions={screen.actions} />
              ) : (
                <SortableContext
                  items={screen.actions.map((a) => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {screen.actions.length === 0 ? (
                    <div className="flex flex-col gap-4 min-h-25 p-3 bg-muted/10 rounded-xl border-2 border-dashed border-muted transition-colors hover:border-muted-foreground/20 items-center justify-center py-12 text-muted-foreground">
                      <Plus className="h-8 w-8 mb-2 opacity-10" />
                      <p className="text-xs font-medium">
                        No actions added to this screen yet
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {screen.actions.map((action, idx) => (
                        <>
                          <SortableActionItem
                            key={action.id}
                            action={action}
                            index={idx}
                            isEditing={activeActionId === action.id}
                            onEdit={() =>
                              onEditAction(
                                activeActionId === action.id ? "" : action.id,
                              )
                            }
                            onDelete={() => onDeleteAction(action.id)}
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
                                    className="h-7 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors"
                                    onClick={() => onEditAction("")}
                                  >
                                    Close Editor
                                  </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-6">
                                  <ActionContentEditor
                                    action={activeActionInScreen}
                                    onChange={(updates) =>
                                      onUpdateAction(
                                        activeActionInScreen.id,
                                        updates,
                                      )
                                    }
                                  />
                                </CardContent>
                              </Card>
                            )}
                        </>
                      ))}
                    </div>
                  )}
                </SortableContext>
              )}
            </DndContext>

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
      </Card>

      <ActionTypeSelector
        open={isActionSelectorOpen}
        onOpenChange={setIsActionSelectorOpen}
        onSelect={(type) => onAddAction(type)}
      />
    </div>
  );
}
