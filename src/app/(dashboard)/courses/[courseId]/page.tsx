"use client";

import { useState, use } from "react";
import { UnitSortableList } from "@/components/features/units/unit-sortable-list";
import { UnitForm } from "@/components/features/units/unit-form";
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
import { CourseDetailForm } from "@/components/features/courses/course-detail-form";
import { useEntityDetail } from "@/hooks/use-entity-detail";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const {
    entity: course,
    form: courseForm,
    setForm: setCourseForm,
    children: units,
    setChildren: setUnits,
    loading,
    saving,
    save,
    remove,
    fetchData,
  } = useEntityDetail({
    apiPath: "/api/courses",
    entityId: courseId,
    formDefaults: {
      name: "",
      description: "",
      price: 0,
      isActive: true,
      purchaseable: true,
    },
    redirectPath: "/courses",
    entityLabel: "Course",
    mapData: (data) => ({
      form: {
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        isActive: data.isActive ?? true,
        purchaseable: data.purchaseable ?? true,
      },
      children: data.children,
      raw: data,
    }),
  });

  async function handleDeleteChild(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/units/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Unit deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting");
    }
  }

  if (loading && !course) {
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
      <PageHeader title="Course" />
      <Breadcrumb
        items={[{ label: "Course", href: "#" }]}
      />

      <CourseDetailForm form={courseForm} onFormChange={setCourseForm} />

      <div className="pt-4 border-t">
        <UnitSortableList
          title="Units"
          courseId={courseId}
          units={units}
          onReorder={(newItems) => setUnits(newItems)}
          onEdit={(unit) => {
            setSelectedUnit(unit);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteChild}
          addButton={
            <Button
              onClick={() => {
                setSelectedUnit(null);
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
              {selectedUnit ? "Edit Unit" : "Add New Unit"}
            </DialogTitle>
          </DialogHeader>
          <UnitForm
            courseId={courseId}
            initialData={selectedUnit}
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
