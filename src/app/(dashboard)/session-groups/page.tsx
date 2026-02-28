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
import { SessionGroupForm } from "@/components/features/session-groups/session-group-form";
import {
  SessionGroupTable,
  SessionGroupItem,
} from "@/components/features/session-groups/session-group-table";
import { PageHeader } from "@/components/layouts/page-header";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { toast } from "sonner";

export default function SessionGroupsListPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SessionGroupItem | null>(
    null,
  );
  const [deletingGroup, setDeletingGroup] = useState<SessionGroupItem | null>(
    null,
  );

  async function handleDelete() {
    if (!deletingGroup) return;
    try {
      const res = await fetch(`/api/session-groups/${deletingGroup._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete group");
      toast.success("Group deleted");
      setRefreshKey((prev) => prev + 1);
      setDeletingGroup(null);
    } catch (error) {
      toast.error("Error deleting group");
    }
  }

  function handleSuccess() {
    setIsAddOpen(false);
    setEditingGroup(null);
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Session Groups" />

      <SessionGroupTable
        key={refreshKey}
        onEdit={setEditingGroup}
        onDelete={setDeletingGroup}
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
            <DialogTitle>Add New Session Group</DialogTitle>
          </DialogHeader>
          <SessionGroupForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingGroup}
        onOpenChange={(open) => !open && setEditingGroup(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session Group</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <SessionGroupForm
              initialData={editingGroup}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deletingGroup}
        onOpenChange={(open) => !open && setDeletingGroup(null)}
        onConfirm={handleDelete}
        itemName={deletingGroup?.name}
        entityLabel="group"
      />
    </div>
  );
}
