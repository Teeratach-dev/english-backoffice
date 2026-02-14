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
import { Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicsPage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string }>;
}) {
  const { courseId, unitId } = use(params);
  const [topics, setTopics] = useState<any[]>([]);
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

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
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/courses/${courseId}/units`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Topics: {unit?.name}
          </h1>
          <p className="text-muted-foreground">
            Manage topics for this lesson.
          </p>
        </div>
        <Button className="ml-auto" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Topic
        </Button>
      </div>

      <TopicSortableList
        courseId={courseId}
        unitId={unitId}
        topics={topics}
        onReorder={(newItems) => setTopics(newItems)}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
