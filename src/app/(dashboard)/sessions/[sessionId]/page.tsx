"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Smartphone,
  PenTool,
  Trash2,
  X,
  Save,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { arrayMove } from "@dnd-kit/sortable";
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
import { SaveTemplateDialog } from "@/components/features/sessions/builder/save-template-dialog";
import { LoadTemplateDialog } from "@/components/features/sessions/builder/load-template-dialog";
import { SortableScreenCard } from "@/components/features/sessions/builder/sortable-screen-card";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { StickyFooter } from "@/components/layouts/sticky-footer";
import { DeleteButton } from "@/components/common/delete-button";
import { SaveButton } from "@/components/common/save-button";

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{
    sessionId: string;
  }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [screens, setScreens] = useState<
    (Screen & { localId?: number; isCollapsed?: boolean })[]
  >([]);
  const [nextScreenId, setNextScreenId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    name: "",
    type: "reading",
    cefrLevel: "A1",
    isActive: true,
  });

  async function fetchSession() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}?include=breadcrumbs`);
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setSession(data);
      const initialF = {
        name: data.name || "",
        type: data.type || "reading",
        cefrLevel: data.cefrLevel || "A1",
        isActive: data.isActive ?? true,
      };
      setSessionForm(initialF);

      const mappedScreens = (data.screens || []).map(
        (s: any, sIdx: number) => ({
          id: `scr-${sIdx}-${Date.now()}`,
          sequence: sIdx,
          localId: sIdx + 1,
          isCollapsed: false,
          actions: (s.actions || []).map((a: any, aIdx: number) => ({
            id: `act-${sIdx}-${aIdx}-${Date.now()}`,
            ...a,
            sequence: aIdx,
          })),
        }),
      );
      setScreens(mappedScreens);
      setNextScreenId(mappedScreens.length + 1);
    } catch (error) {
      toast.error("Error loading session");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const parentPath = session?.sessionGroupId
    ? `/session-groups/${session.sessionGroupId}`
    : "/sessions";

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
              ...actionData,
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

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this session? This action cannot be undone.",
      )
    )
      return;

    setSaving(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete session");
      toast.success("Session deleted successfully");
      router.push(parentPath);
    } catch (error) {
      toast.error("Error deleting session");
    } finally {
      setSaving(false);
    }
  }

  async function fetchTemplates(filters?: { isActive: boolean; type: string }) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const isActive = filters?.isActive ?? true;
      const type = filters?.type;

      if (isActive) params.append("isActive", "true");

      if (type && type !== "all") {
        params.append("type", type);
      } else if (!type) {
        if (session?.type) params.append("type", session.type);
      }

      const res = await fetch(`/api/templates?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      setAvailableTemplates(data);
    } catch (error) {
      toast.error("Error loading templates");
    } finally {
      setLoading(false);
    }
  }

  function handleApplyTemplate(template: any) {
    const newScreens = template.screens.map((ts: any, sIdx: number) => ({
      id: `scr-tmp-${sIdx}-${Date.now()}`,
      localId: sIdx + 1,
      isCollapsed: false,
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
      setNextScreenId(newScreens.length + 1);
      setIsLoadDialogOpen(false);
    }
  }

  async function handleSaveAsTemplate(overwriteId?: string) {
    if (!templateName) {
      toast.error("Template name is required");
      return;
    }

    setSaving(true);
    try {
      const templateData = {
        name: templateName,
        type: session.type,
        isActive: true,
        screens: screens.map((s, sIdx) => ({
          sequence: sIdx,
          actionTypes: s.actions.map((a) => a.type),
        })),
      };

      if (overwriteId) {
        const res = await fetch(`/api/templates/${overwriteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateData),
        });
        if (!res.ok) throw new Error("Failed to update template");
        toast.success("Template updated successfully");
      } else {
        const checkRes = await fetch(
          `/api/templates/check?type=${session.type}&screens=${JSON.stringify(templateData.screens.map((s) => s.actionTypes))}`,
        );
        if (checkRes.ok) {
          const { exists } = await checkRes.json();
          if (exists) {
            if (!confirm("A similar template already exists. Create anyway?")) {
              setSaving(false);
              return;
            }
          }
        }

        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateData),
        });

        if (!res.ok) throw new Error("Failed to save template");
        toast.success("Template saved successfully");
      }

      setIsTemplateDialogOpen(false);
      setTemplateName("");
      fetchTemplates();
    } catch (error) {
      toast.error("Error saving template");
    } finally {
      setSaving(false);
    }
  }

  function moveScreen(index: number, direction: "up" | "down") {
    setScreens((prev) => {
      const newScreens = [...prev];
      if (direction === "up" && index > 0) {
        [newScreens[index], newScreens[index - 1]] = [
          newScreens[index - 1],
          newScreens[index],
        ];
      } else if (direction === "down" && index < newScreens.length - 1) {
        [newScreens[index], newScreens[index + 1]] = [
          newScreens[index + 1],
          newScreens[index],
        ];
      }
      return newScreens;
    });
  }

  function addScreen() {
    setScreens([
      ...screens,
      {
        id: `scr-${Date.now()}`,
        sequence: screens.length,
        localId: nextScreenId,
        isCollapsed: false,
        actions: [],
      },
    ]);
    setNextScreenId((prev) => prev + 1);
  }

  function deleteScreen(id: string) {
    setScreens(screens.filter((s) => s.id !== id));
  }

  function toggleScreenCollapse(id: string) {
    setScreens(
      screens.map((s) =>
        s.id === id ? { ...s, isCollapsed: !s.isCollapsed } : s,
      ),
    );
  }

  function toggleAllScreens(collapse: boolean) {
    setScreens(screens.map((s) => ({ ...s, isCollapsed: collapse })));
  }

  function addActionToScreen(screenId: string, type: ActionType) {
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
  }

  function reorderActions(screenId: string, activeId: string, overId: string) {
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
  }

  function deleteAction(screenId: string, actionId: string) {
    setScreens(
      screens.map((s) => {
        if (s.id === screenId) {
          return { ...s, actions: s.actions.filter((a) => a.id !== actionId) };
        }
        return s;
      }),
    );
    if (activeActionId === actionId) setActiveActionId(null);
  }

  function updateActionContent(actionId: string, updates: any) {
    setScreens(
      screens.map((s) => ({
        ...s,
        actions: s.actions.map((a) =>
          a.id === actionId ? { ...a, ...updates } : a,
        ),
      })),
    );
  }

  function findActiveAction() {
    if (!activeActionId) return null;
    for (const screen of screens) {
      const action = screen.actions.find((a) => a.id === activeActionId);
      if (action) return action;
    }
    return null;
  }

  const activeAction = findActiveAction();

  if (loading && !session) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Build breadcrumbs from API response
  const breadcrumbItems = [];
  if (session?.courseId) {
    breadcrumbItems.push({
      label: "Courses",
      href: `/courses/${session.courseId}`,
    });
  }
  if (session?.unitId) {
    breadcrumbItems.push({ label: "Units", href: `/units/${session.unitId}` });
  }
  if (session?.topicId) {
    breadcrumbItems.push({
      label: "Topics",
      href: `/topics/${session.topicId}`,
    });
  }
  if (session?.sessionGroupId) {
    breadcrumbItems.push({
      label: "Groups",
      href: `/session-groups/${session.sessionGroupId}`,
    });
  }
  breadcrumbItems.push({ label: "Session", href: "#" });

  return (
    <div className="space-y-3 min-[550px]:space-y-6">
      <PageHeader title="Session" />
      <Breadcrumb items={breadcrumbItems} />
      <div>
        <Card>
          <SessionBuilderHeader
            sessionName={sessionForm.name || session?.name}
            sessionType={sessionForm.type || session?.type}
            cefrLevel={sessionForm.cefrLevel || session?.cefrLevel}
            saving={saving}
            onSave={handleSave}
            onLoadTemplate={() => setIsLoadDialogOpen(true)}
            onOpenSaveTemplate={() => setIsTemplateDialogOpen(true)}
            hasScreens={screens.length > 0}
          />
          <CardContent className="space-y-4 max-[550px]:px-2">
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
        </Card>
        <div className="flex items-center mt-6 mb-4">
          <h2 className="text-xl font-semibold">Screens</h2>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={function () {
                const someOpen = screens.some((s) => !s.isCollapsed);
                toggleAllScreens(someOpen);
              }}
              disabled={screens.length === 0}
            >
              {screens.some((s) => !s.isCollapsed) ? (
                <ChevronsUp className="h-4 w-4 mr-0 min-[550px]:mr-2" />
              ) : (
                <ChevronsDown className="h-4 w-4 mr-0 min-[550px]:mr-2" />
              )}
              <span className="hidden min-[550px]:inline">
                {screens.some((s) => !s.isCollapsed)
                  ? "Collapse All"
                  : "Expand All"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="mr-2 lg:hidden"
              onClick={function () {
                setShowPreview(!showPreview);
              }}
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
            <Button onClick={addScreen} size="sm">
              <Plus className="h-4 w-4 mr-0 min-[550px]:mr-2" />
              <span className="hidden min-[550px]:inline">Add Screen</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3 min-[550px]:space-y-6">
          {screens.map((screen, sIdx) => (
            <SortableScreenCard
              key={screen.id}
              screen={screen}
              sIdx={sIdx}
              activeActionId={activeActionId}
              onDelete={() => deleteScreen(screen.id)}
              onAddAction={(type) => addActionToScreen(screen.id, type)}
              onDeleteAction={(actionId) => deleteAction(screen.id, actionId)}
              onEditAction={(actionId) => setActiveActionId(actionId)}
              onReorderActions={(activeId, overId) =>
                reorderActions(screen.id, activeId, overId)
              }
              onUpdateAction={updateActionContent}
              showPreview={showPreview}
              onMoveUp={() => moveScreen(sIdx, "up")}
              onMoveDown={() => moveScreen(sIdx, "down")}
              isFirst={sIdx === 0}
              isLast={sIdx === screens.length - 1}
              screenNumber={screen.localId || sIdx + 1}
              isCollapsed={screen.isCollapsed}
              onToggleCollapse={function () {
                toggleScreenCollapse(screen.id);
              }}
            />
          ))}
        </div>
      </div>

      <StickyFooter>
        <DeleteButton onClick={handleDelete} disabled={saving} />
        <SaveButton onClick={handleSave} loading={saving} />
      </StickyFooter>

      <SaveTemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        templateName={templateName}
        onTemplateNameChange={setTemplateName}
        onSave={handleSaveAsTemplate}
        saving={saving}
        templates={availableTemplates}
        onFetch={fetchTemplates}
        loading={loading}
      />

      <LoadTemplateDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        templates={availableTemplates}
        onApplyTemplate={handleApplyTemplate}
        onFetch={fetchTemplates}
        loading={loading}
      />
    </div>
  );
}
