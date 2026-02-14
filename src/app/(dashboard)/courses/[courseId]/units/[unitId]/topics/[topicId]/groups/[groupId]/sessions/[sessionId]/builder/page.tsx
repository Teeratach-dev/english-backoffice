"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ActionType, Action, Screen, getDefaultContent } from "@/types/action.types";
import { SessionBuilderHeader } from "@/components/features/sessions/builder/session-builder-header";
import { SessionBuilderSidebar } from "@/components/features/sessions/builder/session-builder-sidebar";
import { SaveTemplateDialog } from "@/components/features/sessions/builder/save-template-dialog";
import { LoadTemplateDialog } from "@/components/features/sessions/builder/load-template-dialog";
import { SortableScreenCard } from "@/components/features/sessions/builder/sortable-screen-card";

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
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

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
          sequence: sIdx,
          actions: (s.actions || []).map((a: any, aIdx: number) => ({
            id: `act-${sIdx}-${aIdx}-${Date.now()}`,
            type: a.type,
            ...a.content,
            sequence: aIdx,
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
          actions: s.actions.map((a, aIdx) => {
            const { id, sequence, ...actionData } = a;
            return {
              type: a.type,
              content: actionData,
              sequence: aIdx,
            };
          }),
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
        ...getDefaultContent(type as ActionType),
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

      const checkRes = await fetch(
        `/api/templates/check?type=${session.type}&screens=${JSON.stringify(templateData.screens.map((s) => s.actionTypes))}`,
      );
      if (checkRes.ok) {
        const { exists } = await checkRes.json();
        if (exists) {
          toast.error(
            "A session template with same configuration already exists.",
          );
          setSaving(false);
          return;
        }
      }

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
    setScreens([
      ...screens,
      {
        id: `scr-${Date.now()}`,
        sequence: screens.length,
        actions: [],
      },
    ]);
  };

  const deleteScreen = (id: string) => {
    setScreens(screens.filter((s) => s.id !== id));
  };

  const addActionToScreen = (screenId: string, type: ActionType) => {
    setScreens(
      screens.map((s) => {
        if (s.id === screenId) {
          const newActionId = `act-${Date.now()}`;
          return {
            ...s,
            actions: [
              ...s.actions,
              {
                id: newActionId,
                ...getDefaultContent(type),
                sequence: s.actions.length,
              } as Action & { id: string; sequence: number },
            ],
          };
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
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          const oldIndex = s.actions.findIndex((a) => a.id === activeId);
          const newIndex = s.actions.findIndex((a) => a.id === overId);
          return { ...s, actions: arrayMove(s.actions, oldIndex, newIndex) };
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
    if (activeActionId === actionId) setActiveActionId(null);
  };

  const updateActionContent = (actionId: string, updates: any) => {
    setScreens(
      screens.map((s) => ({
        ...s,
        actions: s.actions.map((a) =>
          a.id === actionId ? { ...a, ...updates } : a,
        ),
      })),
    );
  };

  const findActiveAction = () => {
    if (!activeActionId) return null;
    for (const screen of screens) {
      const action = screen.actions.find((a) => a.id === activeActionId);
      if (action) return action;
    }
    return null;
  };

  const activeAction = findActiveAction();

  if (loading && !session) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <SessionBuilderHeader
        courseId={courseId}
        unitId={unitId}
        topicId={topicId}
        groupId={groupId}
        sessionName={session?.name}
        sessionType={session?.type}
        cefrLevel={session?.cefrLevel}
        saving={saving}
        onSave={handleSave}
        onLoadTemplate={fetchTemplates}
        onOpenSaveTemplate={() => setIsTemplateDialogOpen(true)}
        hasScreens={screens.length > 0}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 bg-muted/5 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
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
                    activeActionId={activeActionId}
                    onDelete={() => deleteScreen(screen.id)}
                    onAddAction={(type) => addActionToScreen(screen.id, type)}
                    onDeleteAction={(actionId) =>
                      deleteAction(screen.id, actionId)
                    }
                    onEditAction={(actionId) => setActiveActionId(actionId)}
                    onReorderActions={(activeId, overId) =>
                      reorderActions(screen.id, activeId, overId)
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button
              variant="outline"
              className="w-full border-dashed py-10 hover:bg-muted/10 transition-colors"
              onClick={addScreen}
            >
              <Plus className="mr-2 h-5 w-5" /> Add New Screen
            </Button>
          </div>
        </div>

        <SessionBuilderSidebar
          activeAction={activeAction}
          activeActionId={activeActionId}
          onClose={() => setActiveActionId(null)}
          onUpdateAction={updateActionContent}
        />
      </div>

      <SaveTemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        onSave={handleSaveAsTemplate}
        saving={saving}
      />

      <LoadTemplateDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        templates={availableTemplates}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
}
