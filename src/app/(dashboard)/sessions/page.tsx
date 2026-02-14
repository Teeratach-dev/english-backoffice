"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { SESSION_TYPE_LABELS } from "@/types/action.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionForm } from "@/components/features/sessions/session-form";

interface SessionItem {
  _id: string;
  name: string;
  type: string;
  cefrLevel: string;
  sessionGroupName?: string;
  sessionGroupId?: string;
  isActive: boolean;
  sequence: number;
  createdAt: string;
}

export default function SessionsListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionItem | null>(
    null,
  );
  const [deletingSession, setDeletingSession] = useState<SessionItem | null>(
    null,
  );

  async function fetchSessions() {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const result = await res.json();
      setSessions(result.data || []);
    } catch (error) {
      toast.error("Error loading sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  async function handleDelete() {
    if (!deletingSession) return;
    try {
      const res = await fetch(`/api/sessions/${deletingSession._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete session");
      toast.success("Session deleted");
      fetchSessions();
      setDeletingSession(null);
    } catch (error) {
      toast.error("Error deleting session");
    }
  }

  const filteredSessions = sessions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.sessionGroupName || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Details</h1>
          <p className="text-muted-foreground">
            View and manage all session details across all groups.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Session
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sessions or group name..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="max-w-[200px]">Session Group</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>CEFR Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No sessions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => (
                  <TableRow
                    key={session._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(
                        `/groups/${session.sessionGroupId}/sessions/${session._id}/builder`,
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {session.name}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {session.sessionGroupName || "—"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {SESSION_TYPE_LABELS[
                          session.type as keyof typeof SESSION_TYPE_LABELS
                        ] || session.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                        {session.cefrLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          session.isActive
                            ? "bg-success text-success-foreground"
                            : "bg-error text-error-foreground"
                        }`}
                      >
                        {session.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSession(session);
                          }}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingSession(session);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Session Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Session</DialogTitle>
          </DialogHeader>
          <SessionForm
            onSuccess={() => {
              setIsAddOpen(false);
              fetchSessions();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Session Dialog */}
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
              onSuccess={() => {
                setEditingSession(null);
                fetchSessions();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingSession}
        onOpenChange={(open) => !open && setDeletingSession(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              This action cannot be undone. This will permanently delete the
              session <strong>{deletingSession?.name}</strong> and all its
              associated data.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeletingSession(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
