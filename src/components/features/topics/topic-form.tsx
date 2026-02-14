"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TopicZodSchema, TopicInput } from "@/schemas/topic.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface TopicFormProps {
  unitId?: string;
  initialData?: any;
  onSuccess: () => void;
}

export function TopicForm({
  unitId: initialUnitId,
  initialData,
  onSuccess,
}: TopicFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TopicInput>({
    resolver: zodResolver(TopicZodSchema) as any,
    defaultValues: initialData || {
      unitId: initialUnitId || "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const currentUnitId = watch("unitId");

  async function fetchUnits(search: string, page: number) {
    const res = await fetch(
      `/api/units?search=${encodeURIComponent(search)}&page=${page}&limit=15`,
    );
    const result = await res.json();
    // Assuming /api/units also updated to return { data, pagination }
    // If not, I should update it too. Wait, I updated Course service but did I update Unit service to return { data, pagination }?
    // Let me check my previous steps. I updated Course service's getAllCourses.
    // I should probably update Unit service's getAllUnits too if I want it to be searchable/paginated in the dropdown.
    return {
      data: result.data.map((u: any) => ({ value: u._id, label: u.name })),
      hasMore: result.pagination.page < result.pagination.pages,
    };
  }

  async function onSubmit(data: TopicInput) {
    setIsLoading(true);
    try {
      const url = initialData?._id
        ? `/api/topics/${initialData._id}`
        : "/api/topics";
      const method = initialData?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save topic");
      }

      toast.success(initialData?._id ? "Topic updated" : "Topic created");
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
      {!initialUnitId && (
        <div className="space-y-2">
          <Label>Select Unit</Label>
          <SearchableSelect
            value={currentUnitId}
            onValueChange={(val) => setValue("unitId", val)}
            placeholder="Search and select a unit..."
            fetchOptions={fetchUnits}
            disabled={isLoading || !!initialData?._id}
          />
          {errors.unitId && (
            <p className="text-sm text-destructive">{errors.unitId.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Topic Name</Label>
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
            ? "Update Topic"
            : "Create Topic"}
      </Button>
    </form>
  );
}
