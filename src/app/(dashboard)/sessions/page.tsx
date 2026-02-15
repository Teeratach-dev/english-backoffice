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
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
  CEFR_LEVELS,
} from "@/types/action.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionForm } from "@/components/features/sessions/session-form";
import { PageHeader } from "@/components/layouts/page-header";
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SessionItem {
  _id: string;
  name: string;
  type: string;
  cefrLevel: string;
  sessionGroupName?: string;
  sessionGroupId?: string;
  topicId?: string;
  unitId?: string;
  courseId?: string;
  isActive: boolean;
  sequence: number;
  createdAt: string;
}

const SESSION_FILTERS: FilterGroup[] = [
  {
    key: "type",
    title: "Type",
    options: SESSION_TYPES.map((type) => ({
      label:
        SESSION_TYPE_LABELS[type as keyof typeof SESSION_TYPE_LABELS] || type,
      value: type,
    })),
    allowMultiple: true,
  },
  {
    key: "cefr",
    title: "CEFR Level",
    options: CEFR_LEVELS.map((level) => ({
      label: level,
      value: level,
    })),
    allowMultiple: true,
  },
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

export default function SessionsListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
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
  const [editingSession, setEditingSession] = useState<SessionItem | null>(
    null,
  );
  const [deletingSession, setDeletingSession] = useState<SessionItem | null>(
    null,
  );

  const fetchSessions = useCallback(async () => {
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

      const types = activeFilters["type"];
      if (types && types.length > 0) {
        types.forEach((t) => params.append("type", t));
      }

      const cefr = activeFilters["cefr"];
      if (cefr && cefr.length > 0) {
        cefr.forEach((c) => params.append("cefrLevel", c));
      }

      const res = await fetch(`/api/sessions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const result = await res.json();
      setSessions(result.data || []);
    } catch (error) {
      toast.error("Error loading sessions");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Session Details" />

      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        placeholder="Search session details..."
        filters={SESSION_FILTERS}
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
          {sessions.length === 0 ? (
            <div className="text-center p-8 border rounded-md text-muted-foreground">
              No sessions found.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>
                  router.push(
                    `/courses/${session.courseId}/units/${session.unitId}/topics/${session.topicId}/groups/${session.sessionGroupId}/sessions/${session._id}/builder`,
                  )
                }
              >
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold leading-none tracking-tight">
                        {session.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(session.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSession(session);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingSession(session);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        Type
                      </span>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {SESSION_TYPE_LABELS[
                          session.type as keyof typeof SESSION_TYPE_LABELS
                        ] || session.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        CEFR
                      </span>
                      <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                        {session.cefrLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 col-span-2">
                      <span className="text-xs text-muted-foreground">
                        Session Group
                      </span>
                      <span className="font-medium truncate text-right max-w-[60%]">
                        {session.sessionGroupName || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 col-span-2">
                      <span className="text-xs text-muted-foreground">
                        Status
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          session.isActive
                            ? "bg-success text-success-foreground"
                            : "bg-error text-error-foreground"
                        }`}
                      >
                        {session.isActive ? "Active" : "Inactive"}
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
                <TableHead className="max-w-[200px]">Session Group</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>CEFR Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No sessions found.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow
                    key={session._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(
                        `/courses/${session.courseId}/units/${session.unitId}/topics/${session.topicId}/groups/${session.sessionGroupId}/sessions/${session._id}/builder`,
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
                    <TableCell>{formatDate(session.createdAt)}</TableCell>
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingSession(session);
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
