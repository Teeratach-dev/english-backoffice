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

export interface UnitItem {
  _id: string;
  name: string;
  courseId?: string;
  courseName?: string;
  topicCount: number;
  isActive: boolean;
  sequence: number;
  createdAt: string;
}

const UNIT_FILTERS: FilterGroup[] = [
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

interface UnitTableProps {
  onEdit: (unit: UnitItem) => void;
  addButton?: React.ReactNode;
}

export function UnitTable({ onEdit, addButton }: UnitTableProps) {
  const [units, setUnits] = useState<UnitItem[]>([]);
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

  const fetchUnits = useCallback(async () => {
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

      const res = await fetch(`/api/units?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch units");
      const result = await res.json();
      setUnits(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Error loading units");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, activeFilters]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this unit?")) return;
    try {
      const res = await fetch(`/api/units/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete unit");
      toast.success("Unit deleted");
      fetchUnits();
    } catch (error) {
      toast.error("Error deleting unit");
    }
  }

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const columns: Column<UnitItem>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Course",
      cell: (unit) => unit.courseName || "—",
      className: "max-w-[200px] truncate",
    },
    {
      header: "Topics",
      cell: (unit) => (
        <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
          {unit.topicCount}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (unit) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            unit.isActive
              ? "bg-success text-success-foreground"
              : "bg-error text-error-foreground"
          }`}
        >
          {unit.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (unit) => formatDate(unit.createdAt),
    },
    {
      header: <div className="text-right">Actions</div>,
      headerClassName: "text-right",
      className: "text-right",
      cell: (unit) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onEdit(unit)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(unit._id)}
          >
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
        filters={UNIT_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DataTable
        columns={columns}
        data={units}
        loading={loading}
        onRowClick={(unit) => router.push(`/units/${unit._id}`)}
        minWidth="900px"
        pagination={{
          pagination,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onLimitChange: (limit) =>
            setPagination((prev) => ({ ...prev, limit, page: 1 })),
        }}
        renderCard={(unit) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate pr-2" title={unit.name}>
                  {unit.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(unit.createdAt)}
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
                  onClick={() => onEdit(unit)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => handleDelete(unit._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Total Topics
                </span>
                <span className="text-xs">{unit.topicCount}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-xl",
                    unit.isActive
                      ? "text-success-foreground bg-success"
                      : "text-error-foreground bg-error",
                  )}
                >
                  {unit.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">
                  Course
                </span>
                <span className="text-xs font-medium truncate">
                  {unit.courseName || "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
