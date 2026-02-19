"use client";

import { useEffect, useState, use } from "react";
import { TopicSortableList } from "@/components/features/topics/topic-sortable-list";
import { TopicForm } from "@/components/features/topics/topic-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ChevronLeft, Trash2, X, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { StickyFooter } from "@/components/layouts/sticky-footer";
import { ConfirmDiscardDialog } from "@/components/common/confirm-discard-dialog";
import { DeleteButton } from "@/components/common/delete-button";
import { CancelButton } from "@/components/common/cancel-button";
import { SaveButton } from "@/components/common/save-button";

import { PageHeader } from "@/components/layouts/page-header";

export default function TopicsPage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string }>;
}) {
  const { courseId, unitId } = use(params);
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [unit, setUnit] = useState<any>(null);
  const [unitForm, setUnitForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingUnit, setSavingUnit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [initialForm, setInitialForm] = useState<any>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [topicsRes, unitRes] = await Promise.all([
        fetch(`/api/topics?unitId=${unitId}`),
        fetch(`/api/units/${unitId}`),
      ]);

      if (!topicsRes.ok || !unitRes.ok) throw new Error("Failed to fetch data");

      const [topicsData, unitData] = await Promise.all([
        topicsRes.json(),
        unitRes.json(),
      ]);

      setTopics(topicsData);
      setUnit(unitData);
      const initial = {
        name: unitData.name || "",
        description: unitData.description || "",
        isActive: unitData.isActive ?? true,
      };
      setUnitForm(initial);
      setInitialForm(initial);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveUnit() {
    setSavingUnit(true);
    try {
      const res = await fetch(`/api/units/${unitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unitForm),
      });

      if (!res.ok) throw new Error("Failed to save unit");

      toast.success("Unit updated successfully");
      router.push(`/courses/${courseId}/units`);
    } catch (error) {
      toast.error("Error saving unit");
    } finally {
      setSavingUnit(false);
      setInitialForm(JSON.parse(JSON.stringify(unitForm)));
    }
  }

  async function handleDeleteUnit() {
    if (
      !confirm(
        "Are you sure you want to delete this unit? This will also delete all topics within it.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/units/${unitId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete unit");

      toast.success("Unit deleted successfully");
      router.push(`/courses/${courseId}/units`);
    } catch (error) {
      toast.error("Error deleting unit");
    }
  }
  function handleCancel() {
    const hasChanges = JSON.stringify(unitForm) !== JSON.stringify(initialForm);
    if (hasChanges) {
      setIsDiscardDialogOpen(true);
    } else {
      router.push(`/courses/${courseId}/units`);
    }
  }

  useEffect(() => {
    fetchData();
  }, [unitId]);

  function handleAdd() {
    setSelectedTopic(null);
    setIsDialogOpen(true);
  }

  function handleEdit(topic: any) {
    setSelectedTopic(topic);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
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
    <div className="pb-20 space-y-3 min-[450px]:space-y-6">
      <PageHeader title="Unit" />
      <Breadcrumb
        items={[
          { label: "Courses", href: `/courses/${courseId}/units` },
          { label: "Unit", href: "#" },
        ]}
      />

      <Card>
        <CardHeader className="max-[450px]:px-3">
          <CardTitle>Unit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-[450px]:px-3">
          <div className="grid gap-2">
            <Label htmlFor="unit-name">Unit Name</Label>
            <Input
              id="unit-name"
              value={unitForm.name}
              onChange={(e) =>
                setUnitForm({ ...unitForm, name: e.target.value })
              }
              placeholder="Enter unit name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-desc">Description</Label>
            <Textarea
              id="unit-desc"
              value={unitForm.description}
              onChange={(e) =>
                setUnitForm({ ...unitForm, description: e.target.value })
              }
              placeholder="Enter unit description"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="unit-active"
              checked={unitForm.isActive}
              onCheckedChange={(checked) =>
                setUnitForm({ ...unitForm, isActive: checked })
              }
            />
            <Label htmlFor="unit-active">Active Status</Label>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4 border-t">
        <TopicSortableList
          title="Topics"
          courseId={courseId}
          unitId={unitId}
          topics={topics}
          onReorder={(newItems) => setTopics(newItems)}
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
        <DeleteButton onClick={handleDeleteUnit} />
        <div className="flex gap-4">
          <CancelButton onClick={handleCancel} />
          <SaveButton onClick={handleSaveUnit} loading={savingUnit} />
        </div>
      </StickyFooter>

      <ConfirmDiscardDialog
        open={isDiscardDialogOpen}
        onOpenChange={setIsDiscardDialogOpen}
        onConfirm={() => router.push(`/courses/${courseId}/units`)}
      />

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
