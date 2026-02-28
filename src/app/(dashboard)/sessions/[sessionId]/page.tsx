"use client";

import { useEffect, useState, use } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionBuilderHeader } from "@/components/features/sessions/builder/session-builder-header";
import { SessionInfoCard } from "@/components/features/sessions/builder/session-info-card";
import { ScreensToolbar } from "@/components/features/sessions/builder/screens-toolbar";
import { SaveTemplateDialog } from "@/components/features/sessions/builder/save-template-dialog";
import { LoadTemplateDialog } from "@/components/features/sessions/builder/load-template-dialog";
import { SortableScreenCard } from "@/components/features/sessions/builder/sortable-screen-card";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { PageHeader } from "@/components/layouts/page-header";
import { StickyFooter } from "@/components/layouts/sticky-footer";
import { DeleteButton } from "@/components/common/delete-button";
import { SaveButton } from "@/components/common/save-button";
import { useRouter } from "next/navigation";
import { useSessionBuilder } from "@/hooks/use-session-builder";
import { ActionType, getDefaultContent } from "@/types/action.types";

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [sessionForm, setSessionForm] = useState({
    name: "",
    type: "reading",
    cefrLevel: "A1",
    isActive: true,
  });

  const builder = useSessionBuilder();

  async function fetchSession() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}?include=breadcrumbs`);
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setSession(data);
      setSessionForm({
        name: data.name || "",
        type: data.type || "reading",
        cefrLevel: data.cefrLevel || "A1",
        isActive: data.isActive ?? true,
      });
      builder.initScreens(data.screens || []);
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
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sessionForm,
          screens: builder.getScreensPayload(),
        }),
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

  async function fetchTemplates(filters?: {
    isActive: boolean;
    type: string;
  }) {
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
      builder.setScreens(newScreens);
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
        screens: builder.screens.map((s, sIdx) => ({
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
            if (
              !confirm("A similar template already exists. Create anyway?")
            ) {
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

  if (loading && !session) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const breadcrumbItems = [];
  if (session?.courseId) {
    breadcrumbItems.push({
      label: "Courses",
      href: `/courses/${session.courseId}`,
    });
  }
  if (session?.unitId) {
    breadcrumbItems.push({
      label: "Units",
      href: `/units/${session.unitId}`,
    });
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
        <SessionInfoCard
          form={sessionForm}
          onFormChange={setSessionForm}
          header={
            <SessionBuilderHeader
              sessionName={sessionForm.name || session?.name}
              sessionType={sessionForm.type || session?.type}
              cefrLevel={sessionForm.cefrLevel || session?.cefrLevel}
              saving={saving}
              onSave={handleSave}
              onLoadTemplate={() => setIsLoadDialogOpen(true)}
              onOpenSaveTemplate={() => setIsTemplateDialogOpen(true)}
              hasScreens={builder.screens.length > 0}
            />
          }
        />

        <ScreensToolbar
          screens={builder.screens}
          showPreview={builder.showPreview}
          onToggleAll={(collapse) => builder.toggleAllScreens(collapse)}
          onTogglePreview={() => builder.setShowPreview(!builder.showPreview)}
          onAddScreen={builder.addScreen}
        />

        <div className="space-y-3 min-[550px]:space-y-6">
          {builder.screens.map((screen, sIdx) => (
            <SortableScreenCard
              key={screen.id}
              screen={screen}
              sIdx={sIdx}
              activeActionId={builder.activeActionId}
              onDelete={() => builder.deleteScreen(screen.id)}
              onAddAction={(type) =>
                builder.addActionToScreen(screen.id, type)
              }
              onDeleteAction={(actionId) =>
                builder.deleteAction(screen.id, actionId)
              }
              onEditAction={(actionId) =>
                builder.setActiveActionId(actionId)
              }
              onReorderActions={(activeId, overId) =>
                builder.reorderActions(screen.id, activeId, overId)
              }
              onUpdateAction={builder.updateActionContent}
              showPreview={builder.showPreview}
              onMoveUp={() => builder.moveScreen(sIdx, "up")}
              onMoveDown={() => builder.moveScreen(sIdx, "down")}
              isFirst={sIdx === 0}
              isLast={sIdx === builder.screens.length - 1}
              screenNumber={screen.localId || sIdx + 1}
              isCollapsed={screen.isCollapsed}
              onToggleCollapse={() =>
                builder.toggleScreenCollapse(screen.id)
              }
            />
          ))}
          <button
            onClick={builder.addScreen}
            className="w-full rounded-lg border border-dashed border-muted-foreground/30 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Screen
          </button>
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
