"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate, cn } from "@/lib/utils";
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable, Column, Pagination } from "@/components/common/data-table";

export interface SessionGroupItem {
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

interface SessionGroupTableProps {
  onEdit: (group: SessionGroupItem) => void;
  onDelete: (group: SessionGroupItem) => void;
  addButton?: React.ReactNode;
}

export function SessionGroupTable({
  onEdit,
  onDelete,
  addButton,
}: SessionGroupTableProps) {
  const [groups, setGroups] = useState<SessionGroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const router = useRouter();

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

      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const res = await fetch(`/api/session-groups?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch session groups");
      const result = await res.json();
      setGroups(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Error loading session groups");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, activeFilters]);

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const columns: Column<SessionGroupItem>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Topic",
      cell: (group) => group.topicName || "—",
      className: "max-w-[200px] truncate",
    },
    {
      header: "Sessions",
      cell: (group) => (
        <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
          {group.sessionCount}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (group) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            group.isActive
              ? "bg-success text-success-foreground"
              : "bg-error text-error-foreground"
          }`}
        >
          {group.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (group) => formatDate(group.createdAt),
    },
    {
      header: <div className="text-right">Actions</div>,
      headerClassName: "text-right",
      className: "text-right",
      cell: (group) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onEdit(group)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(group)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        filters={SESSION_GROUP_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DataTable
        columns={columns}
        data={groups}
        loading={loading}
        onRowClick={(group) => router.push(`/session-groups/${group._id}`)}
        minWidth="900px"
        pagination={{
          pagination,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onLimitChange: (limit) =>
            setPagination((prev) => ({ ...prev, limit, page: 1 })),
        }}
        renderCard={(group) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate pr-2" title={group.name}>
                  {group.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(group.createdAt)}
                </p>
              </div>
              <div
                className="flex items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => onEdit(group)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => onDelete(group)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Total Sessions
                </span>
                <span className="text-xs">{group.sessionCount}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-xl",
                    group.isActive
                      ? "text-success-foreground bg-success"
                      : "text-error-foreground bg-error",
                  )}
                >
                  {group.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">
                  Topic
                </span>
                <span className="text-xs font-medium truncate">
                  {group.topicName || "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
