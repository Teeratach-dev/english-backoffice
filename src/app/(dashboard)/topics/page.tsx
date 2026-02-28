"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TopicForm } from "@/components/features/topics/topic-form";
import {
  TopicTable,
  TopicItem,
} from "@/components/features/topics/topic-table";
import { PageHeader } from "@/components/layouts/page-header";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { toast } from "sonner";

export default function TopicsListPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<TopicItem | null>(null);

  async function handleDelete() {
    if (!deletingTopic) return;
    try {
      const res = await fetch(`/api/topics/${deletingTopic._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete topic");
      toast.success("Topic deleted");
      setRefreshKey((prev) => prev + 1);
      setDeletingTopic(null);
    } catch (error) {
      toast.error("Error deleting topic");
    }
  }

  function handleSuccess() {
    setIsAddOpen(false);
    setEditingTopic(null);
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Topics" />

      <TopicTable
        key={refreshKey}
        onEdit={setEditingTopic}
        onDelete={setDeletingTopic}
        addButton={
          <Button
            onClick={() => setIsAddOpen(true)}
            className="h-10 w-10 px-0 min-[450px]:w-auto min-[450px]:px-4"
          >
            <Plus className="h-4 w-4 mr-0 min-[450px]:mr-2" />
            <span className="hidden min-[450px]:inline">Add</span>
          </Button>
        }
      />

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
          </DialogHeader>
          <TopicForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingTopic}
        onOpenChange={(open) => !open && setEditingTopic(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          {editingTopic && (
            <TopicForm initialData={editingTopic} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deletingTopic}
        onOpenChange={(open) => !open && setDeletingTopic(null)}
        onConfirm={handleDelete}
        itemName={deletingTopic?.name}
        entityLabel="topic"
      />
    </div>
  );
}
