"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitZodSchema, UnitInput } from "@/schemas/unit.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface UnitFormProps {
  courseId?: string;
  initialData?: any;
  onSuccess: () => void;
}

export function UnitForm({
  courseId: initialCourseId,
  initialData,
  onSuccess,
}: UnitFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UnitInput>({
    resolver: zodResolver(UnitZodSchema) as any,
    defaultValues: initialData || {
      courseId: initialCourseId || "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const currentCourseId = watch("courseId");

  async function fetchCourses(search: string, page: number) {
    const res = await fetch(
      `/api/courses?search=${encodeURIComponent(search)}&page=${page}&limit=15`,
    );
    const result = await res.json();
    return {
      data: result.data.map((c: any) => ({ value: c._id, label: c.name })),
      hasMore: result.pagination.page < result.pagination.pages,
    };
  }

  async function onSubmit(data: UnitInput) {
    setIsLoading(true);
    try {
      const url = initialData?._id
        ? `/api/units/${initialData._id}`
        : "/api/units";
      const method = initialData?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save unit");
      }

      toast.success(initialData?._id ? "Unit updated" : "Unit created");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!initialCourseId && (
        <div className="space-y-2">
          <Label>Select Course</Label>
          <SearchableSelect
            value={currentCourseId}
            onValueChange={(val) => setValue("courseId", val)}
            placeholder="Search and select a course..."
            fetchOptions={fetchCourses}
            disabled={isLoading || !!initialData?._id}
          />
          {errors.courseId && (
            <p className="text-sm text-destructive">
              {errors.courseId.message}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Unit Name</Label>
        <Input id="name" {...register("name")} disabled={isLoading} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue("isActive", checked)}
          disabled={isLoading}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData?._id
            ? "Update Unit"
            : "Create Unit"}
      </Button>
    </form>
  );
}
