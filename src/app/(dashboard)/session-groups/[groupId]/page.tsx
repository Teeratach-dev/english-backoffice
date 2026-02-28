"use client";

import { useState, use } from "react";
import { SessionSortableList } from "@/components/features/sessions/session-sortable-list";
import { SessionForm } from "@/components/features/sessions/session-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { PageHeader } from "@/components/layouts/page-header";
import { StickyFooter } from "@/components/layouts/sticky-footer";
import { DeleteButton } from "@/components/common/delete-button";
import { SaveButton } from "@/components/common/save-button";
import { SessionGroupDetailForm } from "@/components/features/session-groups/session-group-detail-form";
import { useEntityDetail } from "@/hooks/use-entity-detail";

export default function SessionGroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const {
    entity: group,
    form: groupForm,
    setForm: setGroupForm,
    children: sessions,
    setChildren: setSessions,
    loading,
    saving,
    save,
    remove,
    fetchData,
  } = useEntityDetail({
    apiPath: "/api/session-groups",
    entityId: groupId,
    formDefaults: { name: "", description: "", isActive: true },
    redirectPath: "/topics",
    entityLabel: "Session group",
    mapData: (data) => ({
      form: {
        name: data.name || "",
        description: data.description || "",
        isActive: data.isActive ?? true,
      },
      children: data.children,
      raw: data,
    }),
  });

  const parentPath = group?.topicId ? `/topics/${group.topicId}` : "/topics";

  async function handleDeleteChild(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Session deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting");
    }
  }

  if (loading && !group) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3 min-[450px]:space-y-6">
      <PageHeader title="Session Group" />
      <Breadcrumb
        items={[
          {
            label: "Courses",
            href: group?.courseId
              ? `/courses/${group.courseId}`
              : "/courses",
          },
          {
            label: "Units",
            href: group?.unitId ? `/units/${group.unitId}` : "/units",
          },
          { label: "Topics", href: parentPath },
          { label: "Group", href: "#" },
        ]}
      />

      <SessionGroupDetailForm form={groupForm} onFormChange={setGroupForm} />

      <div className="pt-4 border-t">
        <SessionSortableList
          title="Sessions"
          groupId={groupId}
          sessions={sessions}
          onReorder={(newItems) => setSessions(newItems)}
          onEdit={(session) => {
            setSelectedSession(session);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteChild}
          addButton={
            <Button
              onClick={() => {
                setSelectedSession(null);
                setIsDialogOpen(true);
              }}
              className="h-10 w-10 px-0 min-[450px]:w-auto min-[450px]:px-4"
              size="default"
            >
              <Plus className="h-4 w-4 mr-0 min-[450px]:mr-2" />
              <span className="hidden min-[450px]:inline">Add</span>
            </Button>
          }
        />
      </div>

      <StickyFooter>
        <DeleteButton onClick={remove} />
        <SaveButton onClick={save} loading={saving} />
      </StickyFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSession ? "Edit Session" : "Add New Session"}
            </DialogTitle>
          </DialogHeader>
          <SessionForm
            groupId={groupId}
            initialData={selectedSession}
            onSuccess={() => {
              setIsDialogOpen(false);
              fetchData();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
