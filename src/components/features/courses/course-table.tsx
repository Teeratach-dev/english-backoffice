"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export function CourseTable({ onEdit }: { onEdit: (course: Course) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await fetch("/api/courses?limit=100");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const result = await res.json();
      setCourses(result.data || []);
    } catch (error) {
      toast.error("Error loading courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
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
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
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
                  <TableCell>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </TableCell>
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
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
