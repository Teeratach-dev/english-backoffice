"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
  Layout,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { SESSION_TYPE_LABELS, SESSION_TYPES } from "@/types/action.types";
import { cn, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TemplateForm } from "@/components/features/templates/template-form";
import { PageHeader } from "@/components/layouts/page-header";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Template {
  _id: string;
  name: string;
  type: string;
  isActive: boolean;
  screens: any[];
  createdAt: string;
}

const TEMPLATE_FILTERS: FilterGroup[] = [
  {
    key: "type",
    title: "Type",
    options: SESSION_TYPES.map((type) => ({
      label:
        SESSION_TYPE_LABELS[type as keyof typeof SESSION_TYPE_LABELS] || type,
      value: type,
    })),
    allowMultiple: true,
  },
  {
    key: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    allowMultiple: true,
  },
];

export default function SessionTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const isCardView = useMediaQuery(
    "(max-width: 624px), (min-width: 800px) and (max-width: 880px)",
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);

      const status = activeFilters["status"];
      if (status && status.length > 0) {
        if (status.includes("active") && !status.includes("inactive")) {
          params.append("isActive", "true");
        } else if (status.includes("inactive") && !status.includes("active")) {
          params.append("isActive", "false");
        }
      }

      const types = activeFilters["type"];
      if (types && types.length > 0) {
        types.forEach((t) => params.append("type", t));
      }

      const res = await fetch(`/api/templates?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      toast.error("Error loading templates");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

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

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Template ${!currentStatus ? "activated" : "deactivated"}`);
      fetchTemplates();
    } catch (error) {
      toast.error("Error updating template status");
    }
  }

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    setSelectedTemplate(null);
    setIsAddOpen(true);
  };

  const handleSuccess = () => {
    setIsAddOpen(false);
    setSelectedTemplate(null);
    fetchTemplates();
  };

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Session Templates" />
      <Breadcrumb items={[{ label: "Session Templates", href: "#" }]} />

      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        placeholder="Search session templates..."
        filters={TEMPLATE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </SearchAndFilter>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : isCardView ? (
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center p-8 border rounded-md text-muted-foreground">
              No templates found.
            </div>
          ) : (
            templates.map((template: Template) => (
              <div
                key={template._id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold leading-none tracking-tight">
                        {template.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(template.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(template._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        Type
                      </span>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {SESSION_TYPE_LABELS[
                          template.type as keyof typeof SESSION_TYPE_LABELS
                        ] || template.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        Screens
                      </span>
                      <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                        {template.screens?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        Status
                      </span>
                      <button
                        onClick={() =>
                          handleToggleStatus(template._id, template.isActive)
                        }
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          template.isActive
                            ? "bg-success text-success-foreground hover:bg-success/80"
                            : "bg-error text-error-foreground hover:bg-error/80",
                        )}
                      >
                        {template.isActive ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" /> Inactive
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Screens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No templates found.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template: Template) => (
                  <TableRow key={template._id}>
                    <TableCell className="font-medium">
                      {template.name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {SESSION_TYPE_LABELS[
                          template.type as keyof typeof SESSION_TYPE_LABELS
                        ] || template.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                        {template.screens?.length || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          handleToggleStatus(template._id, template.isActive)
                        }
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          template.isActive
                            ? "bg-success text-success-foreground hover:bg-success/80"
                            : "bg-error text-error-foreground hover:bg-error/80",
                        )}
                      >
                        {template.isActive ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" /> Inactive
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>{formatDate(template.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(template._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? "Edit Template" : "Add New Template"}
            </DialogTitle>
          </DialogHeader>
          <TemplateForm
            initialData={selectedTemplate}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
