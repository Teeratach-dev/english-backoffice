import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus, Eye, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Screen,
  ActionType,
  ACTION_TYPE_VALUES,
  ACTION_TYPE_LABELS,
} from "@/types/action.types";
import { SortableActionItem } from "./sortable-action-item";
import { ActionTypeSelector } from "./action-type-selector";
import { ActionContentEditor } from "./action-content-editor";
import { SessionPreview } from "./session-preview";
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
}: SortableScreenCardProps) {
  const [isActionSelectorOpen, setIsActionSelectorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"form" | "preview">("form");

  const activeActionInScreen = screen.actions.find(
    (a) => a.id === activeActionId,
  );

  // Auto-switch to form mode when an action is selected for editing
  React.useEffect(() => {
    if (activeActionInScreen) {
      setViewMode("form");
    }
  }, [activeActionId]);

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
          className="absolute left-1 top-2 lg:-left-10 lg:top-1/2 lg:-translate-y-1/2 cursor-grab opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-2 z-10"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="absolute right-12 top-2 flex items-center bg-muted/20 rounded-lg p-0.5 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-2 text-[10px] gap-1 rounded-md transition-all",
              viewMode === "form" && "shadow-sm bg-background text-primary",
            )}
            onClick={() => setViewMode("form")}
          >
            <Edit2 className="h-3 w-3" />
            Form
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-2 text-[10px] gap-1 rounded-md transition-all",
              viewMode === "preview" && "shadow-sm bg-background text-primary",
            )}
            onClick={() => setViewMode("preview")}
          >
            <Eye className="h-3 w-3" />
            Preview
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <CardHeader className="py-2 pl-10 lg:pl-6 border-b bg-muted/5">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-[10px] font-bold">
              {sIdx + 1}
            </span>
            Screen {sIdx + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {viewMode === "form" ? (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleActionDragEnd}
              >
                <SortableContext
                  items={screen.actions.map((a) => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3 min-h-25 p-3 bg-muted/10 rounded-xl border-2 border-dashed border-muted transition-colors hover:border-muted-foreground/20">
                    {screen.actions.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Plus className="h-8 w-8 mb-2 opacity-10" />
                        <p className="text-xs font-medium">
                          No actions added to this screen yet
                        </p>
                      </div>
                    ) : (
                      screen.actions.map((action) => (
                        <SortableActionItem
                          key={action.id}
                          action={action}
                          isEditing={activeActionId === action.id}
                          onEdit={() => onEditAction(action.id)}
                          onDelete={() => onDeleteAction(action.id)}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DndContext>

              <Button
                variant="outline"
                className="w-full border-dashed py-6 gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                onClick={() => setIsActionSelectorOpen(true)}
              >
                <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Add Action</span>
              </Button>
            </>
          ) : (
            <div className="w-full">
              {screen.actions.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                  <Eye className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-medium">No actions to preview</p>
                </div>
              ) : (
                screen.actions.map((action, idx) => (
                  <div
                    key={action.id}
                    className="flex flex-col gap-3 p-4 border rounded-xl shadow-sm bg-card "
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {ACTION_ICONS[action.type as ActionType]}
                      </div>
                      <h3 className="font-bold text-sm tracking-tight text-foreground">
                        {ACTION_TYPE_LABELS[action.type as ActionType]}
                      </h3>
                      <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                        #{idx + 1}
                      </span>
                    </div>

                    <SessionPreview action={action} />
                  </div>
                ))
              )}
            </div>
          )}

          {activeActionInScreen && (
            <Card className="mt-6 border-primary/20 shadow-md animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden ring-1 ring-primary/5">
              <CardHeader className="py-2.5 px-4 bg-primary/5 border-b flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    <span className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
                  </div>
                  {ACTION_TYPE_LABELS[activeActionInScreen.type as ActionType]}{" "}
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
                    onUpdateAction(activeActionInScreen.id, updates)
                  }
                />
              </CardContent>
            </Card>
          )}
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
