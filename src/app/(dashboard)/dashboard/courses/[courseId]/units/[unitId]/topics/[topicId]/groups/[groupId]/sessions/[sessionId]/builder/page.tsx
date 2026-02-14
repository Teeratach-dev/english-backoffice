"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Save,
  Plus,
  Trash,
  GripVertical,
  GripHorizontal,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// --- Components ---

interface Action {
  id: string;
  type: string;
  content: any;
}

interface Screen {
  id: string;
  actions: Action[];
}

function SortableActionItem({
  action,
  onDelete,
}: {
  action: Action;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id });

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
      className="flex items-center bg-background border rounded px-3 py-2 shadow-sm relative group/action"
    >
      <div {...attributes} {...listeners} className="cursor-grab mr-2">
        <GripHorizontal className="h-3 w-3 text-muted-foreground" />
      </div>
      <span className="text-xs font-semibold mr-2">{action.type}</span>
      <button
        onClick={onDelete}
        className="text-destructive opacity-0 group-hover/action:opacity-100 transition-opacity ml-1"
      >
        <Trash className="h-3 w-3" />
      </button>
    </div>
  );
}

function SortableScreenCard({
  screen,
  sIdx,
  onDelete,
  onAddAction,
  onDeleteAction,
  onReorderActions,
}: {
  screen: Screen;
  sIdx: number;
  onDelete: () => void;
  onAddAction: (type: string) => void;
  onDeleteAction: (id: string) => void;
  onReorderActions: (id: string, overId: string) => void;
}) {
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
    zIndex: isDragging ? 10 : 1,
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

  const ACTION_TYPES = [
    { type: "Reading", label: "Read" },
    { type: "Writing", label: "Write" },
    { type: "Listening", label: "Listen" },
    { type: "Speaking", label: "Speak" },
    { type: "Gamification", label: "Game" },
    { type: "Grammar", label: "Gram" },
    { type: "Vocabulary", label: "Vocab" },
    { type: "ActionSelection", label: "Choice" },
  ];

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="relative group overflow-visible">
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-10 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity p-2"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-xs">
              {sIdx + 1}
            </span>
            Screen {sIdx + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Horizontal Action List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleActionDragEnd}
          >
            <SortableContext
              items={screen.actions.map((a) => a.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap gap-3 p-4 border-2 border-dashed rounded-lg bg-muted/30 min-h-[60px]">
                {screen.actions.map((action) => (
                  <SortableActionItem
                    key={action.id}
                    action={action}
                    onDelete={() => onDeleteAction(action.id)}
                  />
                ))}
                <div className="flex items-center gap-1 ml-auto">
                  {ACTION_TYPES.map((at) => (
                    <Button
                      key={at.type}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] px-2 border dashed"
                      onClick={() => onAddAction(at.type)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> {at.label}
                    </Button>
                  ))}
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Page ---

export default function SessionBuilderPage({
  params,
}: {
  params: Promise<{
    courseId: string;
    unitId: string;
    topicId: string;
    groupId: string;
    sessionId: string;
  }>;
}) {
  const { courseId, unitId, topicId, groupId, sessionId } = use(params);
  const [session, setSession] = useState<any>(null);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);

  async function fetchSession() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setSession(data);

      const mappedScreens = (data.screens || []).map(
        (s: any, sIdx: number) => ({
          id: `scr-${sIdx}-${Date.now()}`,
          actions: (s.actions || []).map((a: any, aIdx: number) => ({
            id: `act-${sIdx}-${aIdx}-${Date.now()}`,
            ...a,
          })),
        }),
      );
      setScreens(mappedScreens);
    } catch (error) {
      toast.error("Error loading session");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  async function handleSave() {
    setSaving(true);
    try {
      const dataToSave = {
        screens: screens.map((s, sIdx) => ({
          sequence: sIdx,
          actions: s.actions.map((a, aIdx) => ({
            type: a.type,
            content: a.content || {},
            sequence: aIdx,
          })),
        })),
      };

      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      toast.success("Session saved successfully");
    } catch (error) {
      toast.error("Error saving session");
    } finally {
      setSaving(false);
    }
  }

  async function fetchTemplates() {
    try {
      const res = await fetch(`/api/templates?type=${session?.type}`);
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      setAvailableTemplates(data);
      setIsLoadDialogOpen(true);
    } catch (error) {
      toast.error("Error loading templates");
    }
  }

  function handleApplyTemplate(template: any) {
    const newScreens = template.screens.map((ts: any, sIdx: number) => ({
      id: `scr-tmp-${sIdx}-${Date.now()}`,
      actions: ts.actionTypes.map((type: string, aIdx: number) => ({
        id: `act-tmp-${sIdx}-${aIdx}-${Date.now()}`,
        type,
        content: {},
      })),
    }));

    if (
      confirm(
        "Applying a template will replace your current screens. Continue?",
      )
    ) {
      setScreens(newScreens);
      setIsLoadDialogOpen(false);
    }
  }

  async function handleSaveAsTemplate() {
    if (!templateName) {
      toast.error("Template name is required");
      return;
    }

    setSaving(true);
    try {
      const templateData = {
        name: templateName,
        type: session.type,
        screens: screens.map((s, sIdx) => ({
          sequence: sIdx,
          actionTypes: s.actions.map((a) => a.type),
        })),
      };

      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });

      if (!res.ok) throw new Error("Failed to save template");
      toast.success("Template saved successfully");
      setIsTemplateDialogOpen(false);
      setTemplateName("");
    } catch (error) {
      toast.error("Error saving template");
    } finally {
      setSaving(false);
    }
  }

  // Vertical Reorder Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleScreenDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setScreens((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  const addScreen = () => {
    setScreens([...screens, { id: `scr-${Date.now()}`, actions: [] }]);
  };

  const deleteScreen = (id: string) => {
    setScreens(screens.filter((s) => s.id !== id));
  };

  const addActionToScreen = (screenId: string, type: string) => {
    setScreens(
      screens.map((s) => {
        if (s.id === screenId) {
          return {
            ...s,
            actions: [
              ...s.actions,
              { id: `act-${Date.now()}`, type, content: {} },
            ],
          };
        }
        return s;
      }),
    );
  };

  const deleteAction = (screenId: string, actionId: string) => {
    setScreens(
      screens.map((s) => {
        if (s.id === screenId) {
          return { ...s, actions: s.actions.filter((a) => a.id !== actionId) };
        }
        return s;
      }),
    );
  };

  const reorderActions = (
    screenId: string,
    activeId: string,
    overId: string,
  ) => {
    setScreens(
      screens.map((s) => {
        if (s.id === screenId) {
          const oldIndex = s.actions.findIndex((a) => a.id === activeId);
          const newIndex = s.actions.findIndex((a) => a.id === overId);
          return { ...s, actions: arrayMove(s.actions, oldIndex, newIndex) };
        }
        return s;
      }),
    );
  };

  if (loading && !session) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col px-4">
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/dashboard/courses/${courseId}/units/${unitId}/topics/${topicId}/groups/${groupId}/sessions`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {session?.name} - Builder
          </h1>
          <p className="text-sm text-muted-foreground">
            {session?.type} | Level: {session?.cefrLevel}
          </p>
        </div>
        <Button className="ml-auto" onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />{" "}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTemplates} disabled={saving}>
            Load Template
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsTemplateDialogOpen(true)}
            disabled={saving || !screens.length}
          >
            Save as Template
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20 pl-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleScreenDragEnd}
        >
          <SortableContext
            items={screens.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {screens.map((screen, sIdx) => (
              <SortableScreenCard
                key={screen.id}
                screen={screen}
                sIdx={sIdx}
                onDelete={() => deleteScreen(screen.id)}
                onAddAction={(type) => addActionToScreen(screen.id, type)}
                onDeleteAction={(actionId) => deleteAction(screen.id, actionId)}
                onReorderActions={(activeId, overId) =>
                  reorderActions(screen.id, activeId, overId)
                }
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          variant="outline"
          className="w-full border-dashed py-8"
          onClick={addScreen}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Screen
        </Button>
      </div>

      <Dialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. standard Reading Session"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsTemplateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAsTemplate} disabled={saving}>
              {saving ? "Saving..." : "Confirm Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Load from Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {availableTemplates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No templates found for this session type.
              </p>
            ) : (
              availableTemplates.map((template) => (
                <div
                  key={template._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => handleApplyTemplate(template)}
                >
                  <div>
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {template.screens.length} Screens
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    Apply
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsLoadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
