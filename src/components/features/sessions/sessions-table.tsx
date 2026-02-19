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
import {
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
  CEFR_LEVELS,
} from "@/types/action.types";

export interface SessionItem {
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

interface SessionsTableProps {
  onEdit: (session: SessionItem) => void;
  onDelete: (session: SessionItem) => void;
  addButton?: React.ReactNode;
}

export function SessionsTable({
  onEdit,
  onDelete,
  addButton,
}: SessionsTableProps) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
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

      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const res = await fetch(`/api/sessions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const result = await res.json();
      setSessions(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Error loading sessions");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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

  const columns: Column<SessionItem>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Session Group",
      cell: (session) => session.sessionGroupName || "—",
      className: "max-w-[200px] truncate",
    },
    {
      header: "Type",
      cell: (session) => (
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {SESSION_TYPE_LABELS[
            session.type as keyof typeof SESSION_TYPE_LABELS
          ] || session.type}
        </span>
      ),
    },
    {
      header: "CEFR Level",
      cell: (session) => (
        <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
          {session.cefrLevel}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (session) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            session.isActive
              ? "bg-success text-success-foreground"
              : "bg-error text-error-foreground"
          }`}
        >
          {session.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (session) => formatDate(session.createdAt),
    },
    {
      header: <div className="text-right">Actions</div>,
      headerClassName: "text-right",
      className: "text-right",
      cell: (session) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onEdit(session)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(session)}>
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
        filters={SESSION_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DataTable
        columns={columns}
        data={sessions}
        loading={loading}
        onRowClick={(session) =>
          router.push(
            `/courses/${session.courseId}/units/${session.unitId}/topics/${session.topicId}/groups/${session.sessionGroupId}/sessions/${session._id}/builder`,
          )
        }
        minWidth="1000px"
        pagination={{
          pagination,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onLimitChange: (limit) =>
            setPagination((prev) => ({ ...prev, limit, page: 1 })),
        }}
        renderCard={(session) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold truncate pr-2"
                  title={session.name}
                >
                  {session.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(session.createdAt)}
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
                  onClick={() => onEdit(session)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => onDelete(session)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs font-semibold">
                  {SESSION_TYPE_LABELS[
                    session.type as keyof typeof SESSION_TYPE_LABELS
                  ] || session.type}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Level</span>
                <span className="text-xs font-semibold">
                  {session.cefrLevel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-xl",
                    session.isActive
                      ? "text-success-foreground bg-success"
                      : "text-error-foreground bg-error",
                  )}
                >
                  {session.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Group</span>
                <span className="text-xs font-medium truncate max-w-25">
                  {session.sessionGroupName || "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
