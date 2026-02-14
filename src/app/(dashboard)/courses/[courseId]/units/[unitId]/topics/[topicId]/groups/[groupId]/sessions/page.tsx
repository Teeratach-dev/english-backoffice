"use client";

import { useEffect, useState, use } from "react";
import { SessionSortableList } from "@/components/features/sessions/session-sortable-list";
import { SessionForm } from "@/components/features/sessions/session-form";
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

export default function SessionsPage({
  params,
}: {
  params: Promise<{
    courseId: string;
    unitId: string;
    topicId: string;
    groupId: string;
  }>;
}) {
  const { courseId, unitId, topicId, groupId } = use(params);
  const [sessions, setSessions] = useState<any[]>([]);
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [sessionsRes, groupRes] = await Promise.all([
        fetch(`/api/sessions?sessionGroupId=${groupId}`),
        fetch(`/api/session-groups/${groupId}`),
      ]);

      if (!sessionsRes.ok || !groupRes.ok)
        throw new Error("Failed to fetch data");

      const [sessionsData, groupData] = await Promise.all([
        sessionsRes.json(),
        groupRes.json(),
      ]);

      setSessions(sessionsData);
      setGroup(groupData);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [groupId]);

  function handleAdd() {
    setSelectedSession(null);
    setIsDialogOpen(true);
  }

  function handleEdit(session: any) {
    setSelectedSession(session);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
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
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: "Units", href: `/courses/${courseId}/units` },
          {
            label: "Topics",
            href: `/courses/${courseId}/units/${unitId}/topics`,
          },
          {
            label: "Groups",
            href: `/courses/${courseId}/units/${unitId}/topics/${topicId}/groups`,
          },
          { label: `Sessions: ${group?.name || ""}`, href: "#" },
        ]}
      />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/courses/${courseId}/units/${unitId}/topics/${topicId}/groups`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sessions: {group?.name}
          </h1>
          <p className="text-muted-foreground">
            Manage sessions and builder configurations.
          </p>
        </div>
        <Button className="ml-auto" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Session
        </Button>
      </div>

      <SessionSortableList
        courseId={courseId}
        unitId={unitId}
        topicId={topicId}
        groupId={groupId}
        sessions={sessions}
        onReorder={(newItems) => setSessions(newItems)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
