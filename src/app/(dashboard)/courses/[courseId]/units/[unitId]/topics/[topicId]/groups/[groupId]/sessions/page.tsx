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
import { Plus } from "lucide-react";
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
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [group, setGroup] = useState<any>(null);
  const [groupForm, setGroupForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingGroup, setSavingGroup] = useState(false);
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
      setGroupForm({
        name: groupData.name || "",
        description: groupData.description || "",
        isActive: groupData.isActive ?? true,
      });
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveGroup() {
    setSavingGroup(true);
    try {
      const res = await fetch(`/api/session-groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupForm),
      });

      if (!res.ok) throw new Error("Failed to save group");

      toast.success("Session group updated successfully");
      router.push(
        `/courses/${courseId}/units/${unitId}/topics/${topicId}/groups`,
      );
    } catch (error) {
      toast.error("Error saving group");
    } finally {
      setSavingGroup(false);
    }
  }

  async function handleDeleteGroup() {
    if (
      !confirm(
        "Are you sure you want to delete this group? This will also delete all sessions within it.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/session-groups/${groupId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete group");

      toast.success("Group deleted successfully");
      router.push(
        `/courses/${courseId}/units/${unitId}/topics/${topicId}/groups`,
      );
    } catch (error) {
      toast.error("Error deleting group");
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

  http: return (
    <div className="pb-20 space-y-6">
      <PageHeader title="Session Group" />
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: "Units", href: `/courses/${courseId}/units` },
          {
            label: "Topics",
            href: `/courses/${courseId}/units/${unitId}/topics/${topicId}/groups`,
          },
          {
            label: "Group",
            href: "#",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Session Group Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              value={groupForm.name}
              onChange={(e) =>
                setGroupForm({ ...groupForm, name: e.target.value })
              }
              placeholder="Enter group name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="group-desc">Description</Label>
            <Textarea
              id="group-desc"
              value={groupForm.description}
              onChange={(e) =>
                setGroupForm({ ...groupForm, description: e.target.value })
              }
              placeholder="Enter group description"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="group-active"
              checked={groupForm.isActive}
              onCheckedChange={(checked) =>
                setGroupForm({ ...groupForm, isActive: checked })
              }
            />
            <Label htmlFor="group-active">Active Status</Label>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4 border-t">
        <SessionSortableList
          title="Sessions"
          courseId={courseId}
          unitId={unitId}
          topicId={topicId}
          groupId={groupId}
          sessions={sessions}
          onReorder={(newItems) => setSessions(newItems)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButton={
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          }
        />
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between max-w-screen-2xl h-16 px-4 mx-auto">
          <Button
            variant="destructive"
            onClick={handleDeleteGroup}
            className="gap-2"
          >
            Delete Group
          </Button>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/courses/${courseId}/units/${unitId}/topics/${topicId}/groups`,
                )
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveGroup}
              disabled={savingGroup}
              className="min-w-[100px]"
            >
              {savingGroup ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

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
