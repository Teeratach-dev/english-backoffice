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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionGroupForm } from "@/components/features/session-groups/session-group-form";
import { PageHeader } from "@/components/layouts/page-header";

interface SessionGroupItem {
  _id: string;
  name: string;
  topicName?: string;
  topicId?: string;
  sessionCount: number;
  isActive: boolean;
  createdAt: string;
  sequence: number;
}

export default function SessionGroupsListPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<SessionGroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SessionGroupItem | null>(
    null,
  );
  const [deletingGroup, setDeletingGroup] = useState<SessionGroupItem | null>(
    null,
  );

  async function fetchGroups() {
    setLoading(true);
    try {
      const res = await fetch("/api/session-groups");
      if (!res.ok) throw new Error("Failed to fetch session groups");
      const result = await res.json();
      setGroups(result.data || []);
    } catch (error) {
      toast.error("Error loading session groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  async function handleDelete() {
    if (!deletingGroup) return;
    try {
      const res = await fetch(`/api/session-groups/${deletingGroup._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete group");
      toast.success("Group deleted");
      fetchGroups();
      setDeletingGroup(null);
    } catch (error) {
      toast.error("Error deleting group");
    }
  }

  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.topicName || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? g.isActive : !g.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Session Groups" />

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups or topic name..."
            className="pl-8"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 w-36 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="ml-auto">
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Group
          </Button>
        </div>
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
                <TableHead className="max-w-[200px]">Topic</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No session groups found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => (
                  <TableRow
                    key={group._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(
                        `/topics/${group.topicId}/groups/${group._id}/sessions`,
                      )
                    }
                  >
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {group.topicName || "—"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                        {group.sessionCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          group.isActive
                            ? "bg-success text-success-foreground"
                            : "bg-error text-error-foreground"
                        }`}
                      >
                        {group.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(group.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGroup(group);
                          }}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingGroup(group);
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

      {/* Add Group Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Session Group</DialogTitle>
          </DialogHeader>
          <SessionGroupForm
            onSuccess={() => {
              setIsAddOpen(false);
              fetchGroups();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
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
              onSuccess={() => {
                setEditingGroup(null);
                fetchGroups();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingGroup}
        onOpenChange={(open) => !open && setDeletingGroup(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              This action cannot be undone. This will permanently delete the
              group <strong>{deletingGroup?.name}</strong> and all its
              associated data.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeletingGroup(null)}>
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
