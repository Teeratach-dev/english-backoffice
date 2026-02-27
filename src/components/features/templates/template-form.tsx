"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SessionTemplateZodSchema,
  SessionTemplateInput,
} from "@/schemas/session-template.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { SESSION_TYPE_LABELS, SESSION_TYPES } from "@/types/action.types";

interface TemplateFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function TemplateForm({ initialData, onSuccess }: TemplateFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SessionTemplateInput>({
    resolver: zodResolver(SessionTemplateZodSchema) as any,
    defaultValues: initialData || {
      name: "",
      type: "reading",
      isActive: true,
      screens: [],
    },
  });

  const isActive = watch("isActive");
  const currentType = watch("type");

  async function onSubmit(data: SessionTemplateInput) {
    setIsLoading(true);
    try {
      const url = initialData?._id
        ? `/api/templates/${initialData._id}`
        : "/api/templates";
      const method = initialData?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save template");
      }

      toast.success(initialData?._id ? "Template updated" : "Template created");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input id="name" {...register("name")} disabled={isLoading} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Session Type</Label>
        <select
          id="type"
          value={currentType}
          onChange={(e) => setValue("type", e.target.value as any)}
          disabled={isLoading || !!initialData?._id}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {SESSION_TYPES.map((type) => (
            <option key={type} value={type}>
              {SESSION_TYPE_LABELS[type as keyof typeof SESSION_TYPE_LABELS]}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
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
            ? "Update Template"
            : "Create Template"}
      </Button>
    </form>
  );
}
