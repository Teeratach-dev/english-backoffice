"use client";

import { useState } from "react";
import { CourseTable } from "@/components/features/courses/course-table";
import { CourseForm } from "@/components/features/courses/course-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";

export default function CoursesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAdd() {
    setSelectedCourse(null);
    setIsDialogOpen(true);
  }

  function handleEdit(course: any) {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-3 min-[450px]:space-y-6">
      <PageHeader title="Courses" />

      <CourseTable
        key={refreshKey}
        onEdit={handleEdit}
        addButton={
          <Button
            onClick={handleAdd}
            className="h-10 w-10 px-0 min-[450px]:w-auto min-[450px]:px-4"
            size="default"
          >
            <Plus className="h-4 w-4 mr-0 min-[450px]:mr-2" />
            <span className="hidden min-[450px]:inline">Add</span>
          </Button>
        }
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCourse ? "Edit Course" : "Add New Course"}
            </DialogTitle>
          </DialogHeader>
          <CourseForm initialData={selectedCourse} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
