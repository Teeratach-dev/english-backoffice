"use client";

import { useEffect, useState, use } from "react";
import { SessionGroupSortableList } from "@/components/features/session-groups/session-group-sortable-list";
import { SessionGroupForm } from "@/components/features/session-groups/session-group-form";
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

export default function SessionGroupsPage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string; topicId: string }>;
}) {
  const { courseId, unitId, topicId } = use(params);
  const [groups, setGroups] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [groupsRes, topicRes] = await Promise.all([
        fetch(`/api/session-groups?topicId=${topicId}`),
        fetch(`/api/topics/${topicId}`),
      ]);

      if (!groupsRes.ok || !topicRes.ok)
        throw new Error("Failed to fetch data");

      const [groupsData, topicData] = await Promise.all([
        groupsRes.json(),
        topicRes.json(),
      ]);

      setGroups(groupsData);
      setTopic(topicData);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [topicId]);

  function handleAdd() {
    setSelectedGroup(null);
    setIsDialogOpen(true);
  }

  function handleEdit(group: any) {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/courses/${courseId}/units/${unitId}/topics`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Session Groups: {topic?.name}
          </h1>
          <p className="text-muted-foreground">
            Manage session groups for this topic.
          </p>
        </div>
        <Button className="ml-auto" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Group
        </Button>
      </div>

      <SessionGroupSortableList
        courseId={courseId}
        unitId={unitId}
        topicId={topicId}
        groups={groups}
        onReorder={(newItems) => setGroups(newItems)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
