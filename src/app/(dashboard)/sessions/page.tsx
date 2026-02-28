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
import { SessionForm } from "@/components/features/sessions/session-form";
import {
  SessionsTable,
  SessionItem,
} from "@/components/features/sessions/sessions-table";
import { PageHeader } from "@/components/layouts/page-header";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { toast } from "sonner";

export default function SessionsListPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionItem | null>(
    null,
  );
  const [deletingSession, setDeletingSession] = useState<SessionItem | null>(
    null,
  );

  async function handleDelete() {
    if (!deletingSession) return;
    try {
      const res = await fetch(`/api/sessions/${deletingSession._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete session");
      toast.success("Session deleted");
      setRefreshKey((prev) => prev + 1);
      setDeletingSession(null);
    } catch (error) {
      toast.error("Error deleting session");
    }
  }

  function handleSuccess() {
    setIsAddOpen(false);
    setEditingSession(null);
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Session Details" />

      <SessionsTable
        key={refreshKey}
        onEdit={setEditingSession}
        onDelete={setDeletingSession}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Session</DialogTitle>
          </DialogHeader>
          <SessionForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingSession}
        onOpenChange={(open) => !open && setEditingSession(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
          </DialogHeader>
          {editingSession && (
            <SessionForm
              initialData={editingSession}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deletingSession}
        onOpenChange={(open) => !open && setDeletingSession(null)}
        onConfirm={handleDelete}
        itemName={deletingSession?.name}
        entityLabel="session"
      />
    </div>
  );
}
