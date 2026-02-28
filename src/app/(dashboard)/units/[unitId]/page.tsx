"use client";

import { useState, use } from "react";
import { TopicSortableList } from "@/components/features/topics/topic-sortable-list";
import { TopicForm } from "@/components/features/topics/topic-form";
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
import { UnitDetailForm } from "@/components/features/units/unit-detail-form";
import { useEntityDetail } from "@/hooks/use-entity-detail";

export default function UnitDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = use(params);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  const {
    entity: unit,
    form: unitForm,
    setForm: setUnitForm,
    children: topics,
    setChildren: setTopics,
    loading,
    saving,
    save,
    remove,
    fetchData,
  } = useEntityDetail({
    apiPath: "/api/units",
    entityId: unitId,
    formDefaults: { name: "", description: "", isActive: true },
    redirectPath: "/courses",
    entityLabel: "Unit",
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

  const parentPath = unit?.courseId ? `/courses/${unit.courseId}` : "/courses";

  async function handleDeleteChild(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/topics/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Topic deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting");
    }
  }

  if (loading && !unit) {
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
      <PageHeader title="Unit" />
      <Breadcrumb
        items={[
          { label: "Courses", href: parentPath },
          { label: "Unit", href: "#" },
        ]}
      />

      <UnitDetailForm form={unitForm} onFormChange={setUnitForm} />

      <div className="pt-4 border-t">
        <TopicSortableList
          title="Topics"
          unitId={unitId}
          topics={topics}
          onReorder={(newItems) => setTopics(newItems)}
          onEdit={(topic) => {
            setSelectedTopic(topic);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteChild}
          addButton={
            <Button
              onClick={() => {
                setSelectedTopic(null);
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
              {selectedTopic ? "Edit Topic" : "Add New Topic"}
            </DialogTitle>
          </DialogHeader>
          <TopicForm
            unitId={unitId}
            initialData={selectedTopic}
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
