"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { useDebounce } from "@/hooks/use-debounce";

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

      params.append("limit", "100");

      const res = await fetch(`/api/courses?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const result = await res.json();
      setCourses(result.data || []);
    } catch (error) {
      toast.error("Error loading courses");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  return (
    <div className="space-y-4">
      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        placeholder="Search courses..."
        filters={COURSE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      {loading || true ? (
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchaseable</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow
                    key={course._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/courses/${course._id}/units`)}
                  >
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                        {course.unitCount || 0}
                      </span>
                    </TableCell>
                    <TableCell>{course.price.toLocaleString()} THB</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          course.isActive
                            ? "bg-success text-success-foreground"
                            : "bg-error text-error-foreground"
                        }`}
                      >
                        {course.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          course.purchaseable
                            ? "bg-info text-info-foreground"
                            : "bg-neutral text-neutral-foreground"
                        }`}
                      >
                        {course.purchaseable ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(course.createdAt)}</TableCell>
                    <TableCell
                      className="text-right space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(course._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
