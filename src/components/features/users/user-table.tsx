"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, User as UserIcon, Edit, Trash2 } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import {
  SearchAndFilter,
  FilterGroup,
} from "@/components/common/search-and-filter";
import { DataTable, Column, Pagination } from "@/components/common/data-table";
import { useDebounce } from "@/hooks/use-debounce";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserTableProps {
  currentUserRole?: string;
  onEdit?: (user: UserData) => void;
  addButton?: React.ReactNode;
}

const USER_FILTERS: FilterGroup[] = [
  {
    key: "role",
    title: "Role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "Superadmin", value: "superadmin" },
    ],
    allowMultiple: true,
  },
];

export function UserTable({
  currentUserRole,
  onEdit,
  addButton,
}: UserTableProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const debouncedSearch = useDebounce(search, 500);

  const isSuperadmin = currentUserRole === "superadmin";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);

      const roles = activeFilters["role"];
      if (roles && roles.length > 0) {
        roles.forEach((r) => params.append("role", r));
      }

      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const result = await res.json();
      setUsers(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeFilters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, activeFilters]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete user");
      }
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error deleting user",
      );
    }
  };

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  // Client-side filtering is no longer needed as we use server-side pagination
  const filteredUsers = users;

  const columns: Column<UserData>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      cell: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            user.role === "superadmin"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {user.role === "superadmin" ? (
            <Shield className="mr-1 h-3 w-3" />
          ) : (
            <UserIcon className="mr-1 h-3 w-3" />
          )}
          {user.role}
        </span>
      ),
    },
    {
      header: "Joined At",
      cell: (user) => formatDate(user.createdAt),
    },
  ];

  if (isSuperadmin) {
    columns.push({
      header: <div className="text-right">Actions</div>,
      headerClassName: "text-right",
      className: "text-right",
      cell: (user) => (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => onEdit?.(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleDelete(user._id, e)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-4">
      <SearchAndFilter
        searchQuery={search}
        onSearchChange={setSearch}
        filters={USER_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      >
        {addButton}
      </SearchAndFilter>

      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        minWidth="800px"
        pagination={{
          pagination,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onLimitChange: (limit) =>
            setPagination((prev) => ({ ...prev, limit, page: 1 })),
        }}
        renderCard={(user) => (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="h-10 w-10 rounded-full bg-muted shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium uppercase">
                    {user.name.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="font-semibold leading-none tracking-tight truncate pr-2"
                    title={user.name}
                  >
                    {user.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              {isSuperadmin && (
                <div
                  className="flex items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => onEdit?.(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={(e) => handleDelete(user._id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div className="flex-2 flex items-center justify-start gap-2 min-w-50">
                <span className="text-xs text-muted-foreground shrink-0">
                  Email
                </span>
                <span
                  className="text-xs truncate font-medium"
                  title={user.email}
                >
                  {user.email}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-start gap-2 min-w-30">
                <span className="text-xs text-muted-foreground shrink-0">
                  Role
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
                    user.role === "superadmin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {user.role === "superadmin" ? (
                    <Shield className="mr-1 h-3 w-3 shrink-0" />
                  ) : (
                    <UserIcon className="mr-1 h-3 w-3 shrink-0" />
                  )}
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
