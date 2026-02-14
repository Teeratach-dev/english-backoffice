"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SessionGroupZodSchema,
  SessionGroupInput,
} from "@/models/SessionGroup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";

interface SessionGroupFormProps {
  topicId: string;
  initialData?: any;
  onSuccess: () => void;
}

export function SessionGroupForm({
  topicId,
  initialData,
  onSuccess,
}: SessionGroupFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SessionGroupInput>({
    resolver: zodResolver(SessionGroupZodSchema),
    defaultValues: initialData || {
      topicId,
      name: "",
      description: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  async function onSubmit(data: SessionGroupInput) {
    setIsLoading(true);
    try {
      const url = initialData?._id
        ? `/api/session-groups/${initialData._id}`
        : "/api/session-groups";
      const method = initialData?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, topicId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save group");
      }

      toast.success(initialData?._id ? "Group updated" : "Group created");
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
        <Label htmlFor="name">Group Name</Label>
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
            ? "Update Group"
            : "Create Group"}
      </Button>
    </form>
  );
}
