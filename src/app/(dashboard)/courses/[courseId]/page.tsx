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
import { Plus, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { PageHeader } from "@/components/layouts/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { StickyFooter } from "@/components/layouts/sticky-footer";
import { DeleteButton } from "@/components/common/delete-button";
import { SaveButton } from "@/components/common/save-button";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const [units, setUnits] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    purchaseable: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);


  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}?include=children`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();

      setUnits(data.children);
      setCourse(data);
      const initial = {
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        isActive: data.isActive ?? true,
        purchaseable: data.purchaseable ?? true,
      };
      setCourseForm(initial);

    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCourse() {
    setSavingCourse(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm),
      });

      if (!res.ok) throw new Error("Failed to save course");

      toast.success("Course updated successfully");
      router.push("/courses");
    } catch (error) {
      toast.error("Error saving course");
    } finally {
      setSavingCourse(false);

    }
  }

  async function handleDeleteCourse() {
    if (
      !confirm(
        "Are you sure you want to delete this course? This will also delete all units and topics within it.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete course");

      toast.success("Course deleted successfully");
      router.push("/courses");
    } catch (error) {
      toast.error("Error deleting course");
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
    <div className="space-y-3 min-[450px]:space-y-6">
      <PageHeader title="Course" />
      <Breadcrumb
        items={[
          {
            label: "Course",
            href: "#",
          },
        ]}
      />

      <Card>
        <CardHeader className="max-[450px]:px-3">
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-[450px]:px-3">
          <div className="grid gap-2">
            <Label htmlFor="course-name">Course Name</Label>
            <Input
              id="course-name"
              value={courseForm.name}
              onChange={(e) =>
                setCourseForm({ ...courseForm, name: e.target.value })
              }
              placeholder="Enter course name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-desc">Description</Label>
            <Textarea
              id="course-desc"
              value={courseForm.description}
              onChange={(e) =>
                setCourseForm({ ...courseForm, description: e.target.value })
              }
              placeholder="Enter course description"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-price">Price</Label>
            <Input
              id="course-price"
              type="number"
              value={courseForm.price}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  price: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex flex-wrap gap-6 mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="course-active"
                checked={courseForm.isActive}
                onCheckedChange={(checked) =>
                  setCourseForm({ ...courseForm, isActive: checked })
                }
              />
              <Label htmlFor="course-active">Active Status</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="course-purchase"
                checked={courseForm.purchaseable}
                onCheckedChange={(checked) =>
                  setCourseForm({ ...courseForm, purchaseable: checked })
                }
              />
              <Label htmlFor="course-purchase">Purchaseable</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4 border-t">
        <UnitSortableList
          title="Units"
          courseId={courseId}
          units={units}
          onReorder={(newItems) => setUnits(newItems)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButton={
            <Button
              onClick={handleAdd}
              className="h-10 w-10 px-0 min-[450px]:w-auto min-[450px]:px-4"
              size="default"
            >
              <Plus className="h-4 w-4 mr-0 min-[450px]:mr-2" />
              <span className="hidden min-[450px]:inline">Add</span>
            </Button>
          }
        />
      </div>

      {/* Sticky Footer */}
      <StickyFooter>
        <DeleteButton onClick={handleDeleteCourse} />
        <SaveButton onClick={handleSaveCourse} loading={savingCourse} />
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
