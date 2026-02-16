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
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TopicForm } from "@/components/features/topics/topic-form";
import { PageHeader } from "@/components/layouts/page-header";
import { formatDate } from "@/lib/utils";
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TopicItem {
  _id: string;
  name: string;
  unitName?: string;
  unitId?: string;
  courseId?: string;
  sessionGroupCount: number;
  isActive: boolean;
  sequence: number;
  createdAt: string;
}

const FILTER_CONFIG: FilterGroup[] = [
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

export default function TopicsListPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<TopicItem[]>([]);
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
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<TopicItem | null>(null);

  const fetchTopics = useCallback(async () => {
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

      const res = await fetch(`/api/topics?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch topics");
      const result = await res.json();
      setTopics(result.data || []);
    } catch (error) {
      toast.error("Error loading topics");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  async function handleDelete() {
    if (!deletingTopic) return;
    try {
      const res = await fetch(`/api/topics/${deletingTopic._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete topic");
      toast.success("Topic deleted");
      fetchTopics();
      setDeletingTopic(null);
    } catch (error) {
      toast.error("Error deleting topic");
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
      <PageHeader title="Topics" />

      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        filters={FILTER_CONFIG}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        <Button
          onClick={() => setIsAddOpen(true)}
          className="h-10 w-10 px-0 min-[450px]:w-auto min-[450px]:px-4"
        >
          <Plus className="h-4 w-4 mr-0 min-[450px]:mr-2" />
          <span className="hidden min-[450px]:inline">Add</span>
        </Button>
      </SearchAndFilter>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isCardView ? (
        <div className="space-y-4">
          {topics.length === 0 ? (
            <div className="text-center p-8 border rounded-md text-muted-foreground">
              No topics found.
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic._id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>
                  router.push(
                    `/courses/${topic.courseId}/units/${topic.unitId}/topics/${topic._id}/groups`,
                  )
                }
              >
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold leading-none tracking-tight">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(topic.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTopic(topic);
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
                          setDeletingTopic(topic);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground pr-2">
                        Unit
                      </span>
                      <span className="font-medium truncate text-right">
                        {topic.unitName || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        Session Groups
                      </span>
                      <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                        {topic.sessionGroupCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        Status
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          topic.isActive
                            ? "bg-success text-success-foreground"
                            : "bg-error text-error-foreground"
                        }`}
                      >
                        {topic.isActive ? "Active" : "Inactive"}
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
                <TableHead className="max-w-[200px]">Unit</TableHead>
                <TableHead>Session Groups</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No topics found.
                  </TableCell>
                </TableRow>
              ) : (
                topics.map((topic) => (
                  <TableRow
                    key={topic._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(
                        `/courses/${topic.courseId}/units/${topic.unitId}/topics/${topic._id}/groups`,
                      )
                    }
                  >
                    <TableCell className="font-medium">{topic.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {topic.unitName || "—"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                        {topic.sessionGroupCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          topic.isActive
                            ? "bg-success text-success-foreground"
                            : "bg-error text-error-foreground"
                        }`}
                      >
                        {topic.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(topic.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTopic(topic);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingTopic(topic);
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

      {/* Add Topic Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
          </DialogHeader>
          <TopicForm
            onSuccess={() => {
              setIsAddOpen(false);
              fetchTopics();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Topic Dialog */}
      <Dialog
        open={!!editingTopic}
        onOpenChange={(open) => !open && setEditingTopic(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          {editingTopic && (
            <TopicForm
              initialData={editingTopic}
              onSuccess={() => {
                setEditingTopic(null);
                fetchTopics();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingTopic}
        onOpenChange={(open) => !open && setDeletingTopic(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              This action cannot be undone. This will permanently delete the
              topic <strong>{deletingTopic?.name}</strong> and all its
              associated data.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeletingTopic(null)}>
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
