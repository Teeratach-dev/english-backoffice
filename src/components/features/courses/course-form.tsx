"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseZodSchema, CourseInput } from "@/models/Course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface CourseFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseInput>({
    resolver: zodResolver(CourseZodSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      isActive: true,
      purchaseable: true,
    },
  });

  // sync isActive and purchaseable as they use Switch (controlled)
  const isActive = watch("isActive");
  const purchaseable = watch("purchaseable");

  async function onSubmit(data: CourseInput) {
    setIsLoading(true);
    try {
      const url = initialData?._id
        ? `/api/courses/${initialData._id}`
        : "/api/courses";
      const method = initialData?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save course");
      }

      toast.success(initialData?._id ? "Course updated" : "Course created");
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
      <div className="space-y-2">
        <Label htmlFor="name">Course Name</Label>
        <Input id="name" {...register("name")} disabled={isLoading} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (THB)</Label>
        <Input
          id="price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          disabled={isLoading}
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setValue("isActive", checked)}
            disabled={isLoading}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="purchaseable"
            checked={purchaseable}
            onCheckedChange={(checked) => setValue("purchaseable", checked)}
            disabled={isLoading}
          />
          <Label htmlFor="purchaseable">Purchaseable</Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData?._id
            ? "Update Course"
            : "Create Course"}
      </Button>
    </form>
  );
}
