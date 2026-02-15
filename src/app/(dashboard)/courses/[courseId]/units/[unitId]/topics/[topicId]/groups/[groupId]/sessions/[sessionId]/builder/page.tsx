"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
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
import {
  ActionType,
  Action,
  Screen,
  getDefaultContent,
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
  CEFR_LEVELS,
} from "@/types/action.types";
import { SessionBuilderHeader } from "@/components/features/sessions/builder/session-builder-header";
import { SessionBuilderSidebar } from "@/components/features/sessions/builder/session-builder-sidebar";
import { SaveTemplateDialog } from "@/components/features/sessions/builder/save-template-dialog";
import { LoadTemplateDialog } from "@/components/features/sessions/builder/load-template-dialog";
import { SortableScreenCard } from "@/components/features/sessions/builder/sortable-screen-card";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  const [showSessionCard, setShowSessionCard] = useState(true);
  const [sessionForm, setSessionForm] = useState({
    name: "",
    type: "reading",
    cefrLevel: "A1",
    isActive: true,
  });

  async function fetchSession() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setSession(data);
      setSessionForm({
        name: data.name || "",
        type: data.type || "reading",
        cefrLevel: data.cefrLevel || "A1",
        isActive: data.isActive ?? true,
      });

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
        ...sessionForm,
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
      {/* Breadcrumb — always visible at top */}
      <div className="border-b px-8 py-3 bg-background shrink-0">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Courses", href: "/courses" },
              { label: "Units", href: `/courses/${courseId}/units` },
              {
                label: "Topics",
                href: `/courses/${courseId}/units/${unitId}/topics`,
              },
              {
                label: "Groups",
                href: `/courses/${courseId}/units/${unitId}/topics/${topicId}/groups`,
              },
              {
                label: "Sessions",
                href: `/courses/${courseId}/units/${unitId}/topics/${topicId}/groups/${groupId}/sessions`,
              },
              {
                label: sessionForm.name || session?.name || "",
                href: "#",
              },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 bg-muted/5 custom-scrollbar">
          <SessionBuilderHeader
            courseId={courseId}
            unitId={unitId}
            topicId={topicId}
            groupId={groupId}
            sessionName={sessionForm.name || session?.name}
            sessionType={sessionForm.type || session?.type}
            cefrLevel={sessionForm.cefrLevel || session?.cefrLevel}
            saving={saving}
            onSave={handleSave}
            onLoadTemplate={fetchTemplates}
            onOpenSaveTemplate={() => setIsTemplateDialogOpen(true)}
            hasScreens={screens.length > 0}
          />

          {/* Session Detail Card */}
          <div className="max-w-3xl mx-auto mb-6">
            <Card>
              <CardHeader
                className="cursor-pointer flex flex-row items-center justify-between"
                onClick={() => setShowSessionCard(!showSessionCard)}
              >
                <CardTitle>Session Details</CardTitle>
                {showSessionCard ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
              {showSessionCard && (
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="session-name">Session Name</Label>
                    <Input
                      id="session-name"
                      value={sessionForm.name}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, name: e.target.value })
                      }
                      placeholder="Enter session name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="session-type">Type</Label>
                      <select
                        id="session-type"
                        value={sessionForm.type}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            type: e.target.value,
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {SESSION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {
                              SESSION_TYPE_LABELS[
                                type as keyof typeof SESSION_TYPE_LABELS
                              ]
                            }
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="session-cefr">CEFR Level</Label>
                      <select
                        id="session-cefr"
                        value={sessionForm.cefrLevel}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            cefrLevel: e.target.value,
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {CEFR_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="session-active"
                      checked={sessionForm.isActive}
                      onCheckedChange={(checked) =>
                        setSessionForm({ ...sessionForm, isActive: checked })
                      }
                    />
                    <Label htmlFor="session-active">Active Status</Label>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
          <div className="max-w-3xl mx-auto mb-4 flex items-center">
            <h2 className="text-xl font-semibold">Screens</h2>
            <div className="ml-auto">
              <Button onClick={addScreen}>
                <Plus className="mr-2 h-4 w-4" /> + Add
              </Button>
            </div>
          </div>

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
