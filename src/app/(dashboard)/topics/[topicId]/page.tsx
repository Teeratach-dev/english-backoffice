"use client";

import { useState, use } from "react";
import { SessionGroupSortableList } from "@/components/features/session-groups/session-group-sortable-list";
import { SessionGroupForm } from "@/components/features/session-groups/session-group-form";
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
import { TopicDetailForm } from "@/components/features/topics/topic-detail-form";
import { useEntityDetail } from "@/hooks/use-entity-detail";

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const {
    entity: topic,
    form: topicForm,
    setForm: setTopicForm,
    children: groups,
    setChildren: setGroups,
    loading,
    saving,
    save,
    remove,
    fetchData,
  } = useEntityDetail({
    apiPath: "/api/topics",
    entityId: topicId,
    formDefaults: { name: "", description: "", isActive: true },
    redirectPath: "/units",
    entityLabel: "Topic",
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

  const parentPath = topic?.unitId ? `/units/${topic.unitId}` : "/units";

  async function handleDeleteChild(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/session-groups/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Group deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting");
    }
  }

  if (loading && !topic) {
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
      <PageHeader title="Topic" />
      <Breadcrumb
        items={[
          {
            label: "Courses",
            href: topic?.courseId
              ? `/courses/${topic.courseId}`
              : "/courses",
          },
          { label: "Units", href: parentPath },
          { label: "Topic", href: "#" },
        ]}
      />

      <TopicDetailForm form={topicForm} onFormChange={setTopicForm} />

      <div className="pt-4 border-t">
        <SessionGroupSortableList
          title="Session Groups"
          topicId={topicId}
          groups={groups}
          onReorder={(newItems) => setGroups(newItems)}
          onEdit={(group) => {
            setSelectedGroup(group);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteChild}
          addButton={
            <Button
              onClick={() => {
                setSelectedGroup(null);
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
              {selectedGroup ? "Edit Group" : "Add New Group"}
            </DialogTitle>
          </DialogHeader>
          <SessionGroupForm
            topicId={topicId}
            initialData={selectedGroup}
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
