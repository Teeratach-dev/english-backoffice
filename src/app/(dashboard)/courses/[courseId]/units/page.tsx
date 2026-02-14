"use client";

import { useEffect, useState, use } from "react";
import { UnitSortableList } from "@/components/features/units/unit-sortable-list";
import { UnitForm } from "@/components/features/units/unit-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/layouts/breadcrumb";

export default function UnitsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [units, setUnits] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [unitsRes, courseRes] = await Promise.all([
        fetch(`/api/units?courseId=${courseId}`),
        fetch(`/api/courses/${courseId}`),
      ]);

      if (!unitsRes.ok || !courseRes.ok)
        throw new Error("Failed to fetch data");

      const [unitsData, courseData] = await Promise.all([
        unitsRes.json(),
        courseRes.json(),
      ]);

      setUnits(unitsData);
      setCourse(courseData);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [courseId]);

  function handleAdd() {
    setSelectedUnit(null);
    setIsDialogOpen(true);
  }

  function handleEdit(unit: any) {
    setSelectedUnit(unit);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
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
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: `Units: ${course?.name || ""}`, href: "#" },
        ]}
      />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/courses">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Units: {course?.name}
          </h1>
          <p className="text-muted-foreground">
            Manage lessons and order for this course.
          </p>
        </div>
        <Button className="ml-auto" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Unit
        </Button>
      </div>

      <UnitSortableList
        courseId={courseId}
        units={units}
        onReorder={(newItems) => setUnits(newItems)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
