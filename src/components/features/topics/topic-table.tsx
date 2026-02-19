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
import { DataTable, Column } from "@/components/common/data-table";

export interface TopicItem {
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

interface TopicTableProps {
  onEdit: (topic: TopicItem) => void;
  onDelete: (topic: TopicItem) => void;
  addButton?: React.ReactNode;
}

export function TopicTable({ onEdit, onDelete, addButton }: TopicTableProps) {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const router = useRouter();

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

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const columns: Column<TopicItem>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Unit",
      cell: (topic) => topic.unitName || "—",
      className: "max-w-[200px] truncate",
    },
    {
      header: "Session Groups",
      cell: (topic) => (
        <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
          {topic.sessionGroupCount}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (topic) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            topic.isActive
              ? "bg-success text-success-foreground"
              : "bg-error text-error-foreground"
          }`}
        >
          {topic.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (topic) => formatDate(topic.createdAt),
    },
    {
      header: <div className="text-right">Actions</div>,
      headerClassName: "text-right",
      className: "text-right",
      cell: (topic) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onEdit(topic)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(topic)}>
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
        filters={FILTER_CONFIG}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DataTable
        columns={columns}
        data={topics}
        loading={loading}
        onRowClick={(topic) =>
          router.push(
            `/courses/${topic.courseId}/units/${topic.unitId}/topics/${topic._id}/groups`,
          )
        }
        minWidth="900px"
        renderCard={(topic) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate pr-2" title={topic.name}>
                  {topic.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(topic.createdAt)}
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
                  onClick={() => onEdit(topic)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => onDelete(topic)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Total Groups
                </span>
                <span className="text-xs">{topic.sessionGroupCount}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-xl",
                    topic.isActive
                      ? "text-success-foreground bg-success"
                      : "text-error-foreground bg-error",
                  )}
                >
                  {topic.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">
                  Unit
                </span>
                <span className="text-xs font-medium truncate">
                  {topic.unitName || "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
