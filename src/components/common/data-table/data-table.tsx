"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "../../../lib/utils";
import { useMediaQuery } from "../../../hooks/use-media-query";

import { DataTablePagination } from "./data-table-pagination";
import { Pagination } from "../../../types/pagination.types";

export interface Column<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  minWidth?: string;
  renderCard?: (item: T) => React.ReactNode;
  pagination?: {
    pagination: Pagination;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
}

export function DataTable<T extends { _id: string }>({
  columns,
  data,
  loading = false,
  onRowClick,
  emptyMessage = "No data found.",
  minWidth = "800px",
  renderCard,
  pagination,
}: DataTableProps<T>) {
  const isMobile = useMediaQuery("(max-width: 450px)");

  if (loading) {
    return (
      <div className="rounded-md border p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  const renderContent = () => {
    if (isMobile && renderCard) {
      return (
        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="text-center p-8 border rounded-md text-muted-foreground bg-card">
              {emptyMessage}
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item._id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-muted/50",
                )}
              >
                {renderCard(item)}
              </div>
            ))
          )}
        </div>
      );
    }

    return (
      <div className="rounded-md border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <div style={{ minWidth }}>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className={cn(
                        "whitespace-nowrap",
                        column.headerClassName,
                      )}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow
                      key={item._id}
                      className={cn(
                        onRowClick && "cursor-pointer hover:bg-muted/50",
                      )}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((column, index) => (
                        <TableCell key={index} className={column.className}>
                          {column.cell
                            ? column.cell(item)
                            : column.accessorKey
                              ? (item[column.accessorKey] as React.ReactNode)
                              : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderContent()}
      {pagination && (
        <DataTablePagination
          pagination={pagination.pagination}
          onPageChange={pagination.onPageChange}
          onLimitChange={pagination.onLimitChange}
        />
      )}
    </div>
  );
}
