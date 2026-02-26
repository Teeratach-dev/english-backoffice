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
import { StickyFooter } from "@/components/layouts/sticky-footer";
import { ConfirmDiscardDialog } from "@/components/common/confirm-discard-dialog";
import { DeleteButton } from "@/components/common/delete-button";
import { CancelButton } from "@/components/common/cancel-button";
import { SaveButton } from "@/components/common/save-button";

export default function SessionGroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
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
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [initialForm, setInitialForm] = useState<any>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/session-groups/${groupId}?include=children`,
      );
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();

      setSessions(data.children);
      setGroup(data);
      const initial = {
        name: data.name || "",
        description: data.description || "",
        isActive: data.isActive ?? true,
      };
      setGroupForm(initial);
      setInitialForm(initial);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  const parentPath = group?.topicId ? `/topics/${group.topicId}` : "/topics";

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
      router.push(parentPath);
    } catch (error) {
      toast.error("Error saving group");
    } finally {
      setSavingGroup(false);
      setInitialForm(JSON.parse(JSON.stringify(groupForm)));
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
      router.push(parentPath);
    } catch (error) {
      toast.error("Error deleting group");
    }
  }
  function handleCancel() {
    const hasChanges =
      JSON.stringify(groupForm) !== JSON.stringify(initialForm);
    if (hasChanges) {
      setIsDiscardDialogOpen(true);
    } else {
      router.push(parentPath);
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
    <div className="pb-20 space-y-3 min-[450px]:space-y-6">
      <PageHeader title="Session Group" />
      <Breadcrumb
        items={[
          { label: "Courses", href: group?.courseId ? `/courses/${group.courseId}` : "/courses" },
          { label: "Units", href: group?.unitId ? `/units/${group.unitId}` : "/units" },
          { label: "Topics", href: parentPath },
          { label: "Group", href: "#" },
        ]}
      />

      <Card>
        <CardHeader className="max-[450px]:px-3">
          <CardTitle>Session Group Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-[450px]:px-3">
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
          groupId={groupId}
          sessions={sessions}
          onReorder={(newItems) => setSessions(newItems)}
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
        <DeleteButton onClick={handleDeleteGroup} />
        <div className="flex gap-4">
          <CancelButton onClick={handleCancel} />
          <SaveButton onClick={handleSaveGroup} loading={savingGroup} />
        </div>
      </StickyFooter>

      <ConfirmDiscardDialog
        open={isDiscardDialogOpen}
        onOpenChange={setIsDiscardDialogOpen}
        onConfirm={() => router.push(parentPath)}
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
