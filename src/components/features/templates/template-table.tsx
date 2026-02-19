"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate, cn } from "@/lib/utils";
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable, Column } from "@/components/common/data-table";
import { SESSION_TYPE_LABELS, SESSION_TYPES } from "@/types/action.types";

export interface TemplateItem {
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

interface TemplateTableProps {
  onEdit: (template: TemplateItem) => void;
  onRefresh?: () => void;
  addButton?: React.ReactNode;
}

export function TemplateTable({
  onEdit,
  onRefresh,
  addButton,
}: TemplateTableProps) {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const router = useRouter();

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Template deleted");
      fetchTemplates();
      onRefresh?.();
    } catch (error) {
      toast.error("Error deleting template");
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: boolean,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Template ${!currentStatus ? "activated" : "deactivated"}`);
      fetchTemplates();
      onRefresh?.();
    } catch (error) {
      toast.error("Error updating template status");
    }
  };

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const columns: Column<TemplateItem>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Type",
      cell: (template) => (
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {SESSION_TYPE_LABELS[
            template.type as keyof typeof SESSION_TYPE_LABELS
          ] || template.type}
        </span>
      ),
    },
    {
      header: "Screens",
      cell: (template) => (
        <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
          {template.screens?.length || 0}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (template) => (
        <button
          onClick={(e) =>
            handleToggleStatus(template._id, template.isActive, e)
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
      ),
    },
    {
      header: "Created At",
      cell: (template) => formatDate(template.createdAt),
    },
    {
      header: <div className="text-right">Actions</div>,
      headerClassName: "text-right",
      className: "text-right",
      cell: (template) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onEdit(template)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleDelete(template._id, e)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        filters={TEMPLATE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DataTable
        columns={columns}
        data={templates}
        loading={loading}
        onRowClick={(template) => handleEdit(template)}
        minWidth="900px"
        renderCard={(template) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold truncate pr-2"
                  title={template.name}
                >
                  {template.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(template.createdAt)}
                </p>
              </div>
              <div
                className="flex items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(template);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={(e) => handleDelete(template._id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs font-semibold">
                  {SESSION_TYPE_LABELS[
                    template.type as keyof typeof SESSION_TYPE_LABELS
                  ] || template.type}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Screens</span>
                <span className="text-xs">{template.screens?.length || 0}</span>
              </div>
              <div
                className="flex items-center justify-between gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xs text-muted-foreground shrink-0">
                  Status
                </span>
                <button
                  onClick={(e) =>
                    handleToggleStatus(template._id, template.isActive, e)
                  }
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    template.isActive
                      ? "bg-success text-success-foreground hover:bg-success/80"
                      : "bg-error text-error-foreground hover:bg-error/80",
                  )}
                >
                  {template.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );

  function handleEdit(template: TemplateItem) {
    router.push(`/session-templates/${template._id}`);
  }
}
