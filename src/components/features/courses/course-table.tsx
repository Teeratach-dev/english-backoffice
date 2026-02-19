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

interface Course {
  _id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  purchaseable: boolean;
  unitCount: number;
  createdAt: string;
}

const COURSE_FILTERS: FilterGroup[] = [
  {
    key: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    allowMultiple: true,
  },
  {
    key: "purchaseable",
    title: "Purchaseable",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    allowMultiple: true,
  },
];

export function CourseTable({
  onEdit,
  addButton,
}: {
  onEdit: (course: Course) => void;
  addButton?: React.ReactNode;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
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

  const fetchCourses = useCallback(async () => {
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

      const purchaseable = activeFilters["purchaseable"];
      if (purchaseable && purchaseable.length > 0) {
        if (purchaseable.includes("yes") && !purchaseable.includes("no")) {
          params.append("purchaseable", "true");
        } else if (
          purchaseable.includes("no") &&
          !purchaseable.includes("yes")
        ) {
          params.append("purchaseable", "false");
        }
      }

      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const res = await fetch(`/api/courses?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const result = await res.json();
      setCourses(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Error loading courses");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, activeFilters]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete course");
      toast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      toast.error("Error deleting course");
    }
  }

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const columns: Column<Course>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Units",
      cell: (course) => (
        <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
          {course.unitCount || 0}
        </span>
      ),
    },
    {
      header: "Price",
      cell: (course) => `${course.price.toLocaleString()} THB`,
    },
    {
      header: "Status",
      cell: (course) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            course.isActive
              ? "bg-success text-success-foreground"
              : "bg-error text-error-foreground"
          }`}
        >
          {course.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Purchaseable",
      cell: (course) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            course.purchaseable
              ? "bg-info text-info-foreground"
              : "bg-neutral text-neutral-foreground"
          }`}
        >
          {course.purchaseable ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Created At",
      cell: (course) => formatDate(course.createdAt),
    },
    {
      header: <div className="text-right">Actions</div>,
      headerClassName: "text-right",
      className: "text-right",
      cell: (course) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(course._id)}
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
        filters={COURSE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DataTable
        columns={columns}
        data={courses}
        loading={loading}
        onRowClick={(course) => router.push(`/courses/${course._id}/units`)}
        minWidth="1000px"
        pagination={{
          pagination,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onLimitChange: (limit) =>
            setPagination((prev) => ({ ...prev, limit, page: 1 })),
        }}
        renderCard={(course) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold leading-none tracking-tight truncate pr-2"
                  title={course.name}
                >
                  {course.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(course.createdAt)}
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
                  onClick={() => onEdit(course)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => handleDelete(course._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Total Units
                </span>
                <span className="items-center rounded-full text-xs">
                  {course.unitCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Price</span>
                <span className="text-xs">{course.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "text-xs font-semibold  px-2 py-0.5 rounded-xl",
                    course.isActive
                      ? "text-success-foreground bg-success"
                      : "text-error-foreground bg-error",
                  )}
                >
                  {course.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Purchaseable
                </span>
                <span className="text-xs font-semibold">
                  {course.purchaseable ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
