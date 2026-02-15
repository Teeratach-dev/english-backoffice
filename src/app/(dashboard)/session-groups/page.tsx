"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SessionGroupItem {
  _id: string;
  name: string;
  topicName?: string;
  topicId?: string;
  unitId?: string;
  courseId?: string;
  sessionCount: number;
  isActive: boolean;
  createdAt: string;
  sequence: number;
}

const SESSION_GROUP_FILTERS: FilterGroup[] = [
  {
    key: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    allowMultiple: true,
  },
];

export default function SessionGroupsListPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<SessionGroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const isCardView = useMediaQuery(
    "(max-width: 624px), (min-width: 800px) and (max-width: 880px)",
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SessionGroupItem | null>(
    null,
  );
  const [deletingGroup, setDeletingGroup] = useState<SessionGroupItem | null>(
    null,
  );

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);

      const status = activeFilters["status"];
      if (status && status.length > 0) {
        if (status.includes("active") && !status.includes("inactive")) {
          params.append("isActive", "true");
        } else if (status.includes("inactive") && !status.includes("active")) {
          params.append("isActive", "false");
        }
      }

      const res = await fetch(`/api/session-groups?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch session groups");
      const result = await res.json();
      setGroups(result.data || []);
    } catch (error) {
      toast.error("Error loading session groups");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

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

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Session Groups" />

      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        placeholder="Search session groups..."
        filters={SESSION_GROUP_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </SearchAndFilter>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isCardView ? (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="text-center p-8 border rounded-md text-muted-foreground">
              No session groups found.
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group._id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>
                  router.push(
                    `/courses/${group.courseId}/units/${group.unitId}/topics/${group.topicId}/groups/${group._id}/sessions`,
                  )
                }
              >
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold leading-none tracking-tight">
                        {group.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(group.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGroup(group);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingGroup(group);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground block">
                        Topic
                      </span>
                      <span className="font-medium truncate block">
                        {group.topicName || "—"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground block">
                        Sessions
                      </span>
                      <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                        {group.sessionCount}
                      </span>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <span className="text-xs text-muted-foreground block">
                        Status
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          group.isActive
                            ? "bg-success text-success-foreground"
                            : "bg-error text-error-foreground"
                        }`}
                      >
                        {group.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No session groups found.
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow
                    key={group._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(
                        `/courses/${group.courseId}/units/${group.unitId}/topics/${group.topicId}/groups/${group._id}/sessions`,
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingGroup(group);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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
