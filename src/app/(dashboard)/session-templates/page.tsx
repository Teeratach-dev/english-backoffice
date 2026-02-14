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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash, Layout, Copy } from "lucide-react";

interface Template {
  _id: string;
  name: string;
  type: string;
  screens: any[];
  createdAt: string;
}

export default function SessionTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      toast.error("Error loading templates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Template deleted");
      fetchTemplates();
    } catch (error) {
      toast.error("Error deleting template");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Session Templates</h1>
        <p className="text-muted-foreground">
          View and manage reusable session configurations.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Session Type</TableHead>
              <TableHead>Screens</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No templates found. Templates are created from the Session
                  Builder.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template._id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="capitalize">{template.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Layout className="mr-2 h-4 w-4 text-muted-foreground" />
                      {template.screens?.length || 0} Screens
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(template._id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
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
