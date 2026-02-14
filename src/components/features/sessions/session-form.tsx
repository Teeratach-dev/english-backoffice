"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SessionDetailZodSchema,
  SessionDetailInput,
} from "@/models/SessionDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";

interface SessionFormProps {
  groupId: string;
  initialData?: any;
  onSuccess: () => void;
}

const SESSION_TYPES = [
  { value: "ActionSelection", label: "Action Selection" },
  { value: "Reading", label: "Reading" },
  { value: "Writing", label: "Writing" },
  { value: "Listening", label: "Listening" },
  { value: "Speaking", label: "Speaking" },
];

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function SessionForm({
  groupId,
  initialData,
  onSuccess,
}: SessionFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SessionDetailInput>({
    resolver: zodResolver(SessionDetailZodSchema),
    defaultValues: initialData || {
      sessionGroupId: groupId,
      name: "",
      type: "ActionSelection",
      cefrLevel: "A1",
      isActive: true,
      screens: [],
    },
  });

  const isActive = watch("isActive");
  const type = watch("type");
  const cefrLevel = watch("cefrLevel");

  async function onSubmit(data: SessionDetailInput) {
    setIsLoading(true);
    try {
      const url = initialData?._id
        ? `/api/sessions/${initialData._id}`
        : "/api/sessions";
      const method = initialData?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sessionGroupId: groupId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save session");
      }

      toast.success(initialData?._id ? "Session updated" : "Session created");
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
        <Label htmlFor="name">Session Name</Label>
        <Input id="name" {...register("name")} disabled={isLoading} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={type}
            onChange={(e) => setValue("type", e.target.value as any)}
            disabled={isLoading}
          >
            {SESSION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cefrLevel">Level</Label>
          <select
            id="cefrLevel"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={cefrLevel}
            onChange={(e) => setValue("cefrLevel", e.target.value as any)}
            disabled={isLoading}
          >
            {CEFR_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
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
            ? "Update Session"
            : "Create Session"}
      </Button>
    </form>
  );
}
