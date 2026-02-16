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
import { Plus, Trash2, X, Save } from "lucide-react";
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
import { PageHeader } from "@/components/layouts/page-header";
import { ConfirmDiscardDialog } from "@/components/common/confirm-discard-dialog";

export default function SessionGroupsPage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string; topicId: string }>;
}) {
  const { courseId, unitId, topicId } = use(params);
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [topic, setTopic] = useState<any>(null);
  const [topicForm, setTopicForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingTopic, setSavingTopic] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [initialForm, setInitialForm] = useState<any>(null);

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
      const initial = {
        name: topicData.name || "",
        description: topicData.description || "",
        isActive: topicData.isActive ?? true,
      };
      setTopicForm(initial);
      setInitialForm(initial);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTopic() {
    setSavingTopic(true);
    try {
      const res = await fetch(`/api/topics/${topicId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicForm),
      });

      if (!res.ok) throw new Error("Failed to save topic");

      toast.success("Topic updated successfully");
      router.push(`/courses/${courseId}/units/${unitId}/topics`);
    } catch (error) {
      toast.error("Error saving topic");
    } finally {
      setSavingTopic(false);
      setInitialForm(JSON.parse(JSON.stringify(topicForm)));
    }
  }

  async function handleDeleteTopic() {
    if (
      !confirm(
        "Are you sure you want to delete this topic? This will also delete all session groups within it.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/topics/${topicId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete topic");

      toast.success("Topic deleted successfully");
      router.push(`/courses/${courseId}/units/${unitId}/topics`);
    } catch (error) {
      toast.error("Error deleting topic");
    }
  }
  function handleCancel() {
    const hasChanges =
      JSON.stringify(topicForm) !== JSON.stringify(initialForm);
    if (hasChanges) {
      setIsDiscardDialogOpen(true);
    } else {
      router.push(`/courses/${courseId}/units/${unitId}/topics`);
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
    <div className="pb-20 space-y-3 min-[450px]:space-y-6">
      <PageHeader title="Topic" />
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          {
            label: "Units",
            href: `/courses/${courseId}/units/${unitId}/topics`,
          },
          {
            label: "Topic",
            href: "#",
          },
        ]}
      />

      <Card>
        <CardHeader className="max-[450px]:px-3">
          <CardTitle>Topic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-[450px]:px-3">
          <div className="grid gap-2">
            <Label htmlFor="topic-name">Topic Name</Label>
            <Input
              id="topic-name"
              value={topicForm.name}
              onChange={(e) =>
                setTopicForm({ ...topicForm, name: e.target.value })
              }
              placeholder="Enter topic name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="topic-desc">Description</Label>
            <Textarea
              id="topic-desc"
              value={topicForm.description}
              onChange={(e) =>
                setTopicForm({ ...topicForm, description: e.target.value })
              }
              placeholder="Enter topic description"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="topic-active"
              checked={topicForm.isActive}
              onCheckedChange={(checked) =>
                setTopicForm({ ...topicForm, isActive: checked })
              }
            />
            <Label htmlFor="topic-active">Active Status</Label>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4 border-t">
        <SessionGroupSortableList
          title="Session Groups"
          courseId={courseId}
          unitId={unitId}
          topicId={topicId}
          groups={groups}
          onReorder={(newItems) => setGroups(newItems)}
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
        <Button
          variant="ghost"
          onClick={handleDeleteTopic}
          className="gap-2 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden min-[450px]:inline">Delete</span>
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-0 min-[450px]:mr-2" />
            <span className="hidden min-[450px]:inline">Cancel</span>
          </Button>
          <Button
            onClick={handleSaveTopic}
            disabled={savingTopic}
            className="min-w-10 min-[450px]:min-w-25"
          >
            <Save className="h-4 w-4 mr-0 min-[450px]:mr-2" />
            <span className="hidden min-[450px]:inline">
              {savingTopic ? "Saving..." : "Save Changes"}
            </span>
          </Button>
        </div>
      </StickyFooter>

      <ConfirmDiscardDialog
        open={isDiscardDialogOpen}
        onOpenChange={setIsDiscardDialogOpen}
        onConfirm={() =>
          router.push(`/courses/${courseId}/units/${unitId}/topics`)
        }
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
