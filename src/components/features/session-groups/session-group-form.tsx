"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SessionGroupZodSchema,
  SessionGroupInput,
} from "@/schemas/session-group.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface SessionGroupFormProps {
  topicId?: string;
  initialData?: any;
  onSuccess: () => void;
}

export function SessionGroupForm({
  topicId: initialTopicId,
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
    resolver: zodResolver(SessionGroupZodSchema) as any,
    defaultValues: initialData || {
      topicId: initialTopicId || "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const currentTopicId = watch("topicId");

  async function fetchTopics(search: string, page: number) {
    const res = await fetch(
      `/api/topics?search=${encodeURIComponent(search)}&page=${page}&limit=15`,
    );
    const result = await res.json();
    return {
      data: result.data.map((t: any) => ({ value: t._id, label: t.name })),
      hasMore: result.pagination.page < result.pagination.pages,
    };
  }

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
        body: JSON.stringify(data),
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
      {!initialTopicId && (
        <div className="space-y-2">
          <Label>Select Topic</Label>
          <SearchableSelect
            value={currentTopicId}
            onValueChange={(val) => setValue("topicId", val)}
            placeholder="Search and select a topic..."
            fetchOptions={fetchTopics}
            disabled={isLoading || !!initialData?._id}
          />
          {errors.topicId && (
            <p className="text-sm text-destructive">{errors.topicId.message}</p>
          )}
        </div>
      )}

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
