"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/types/pagination.types";

interface DataTablePaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
}

export function DataTablePagination({
  pagination,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTablePaginationProps) {
  const { total, page, limit, pages } = pagination;

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-2 py-10 sm:flex-row sm:justify-between sm:py-4">
      <div className="text-sm text-muted-foreground font-medium order-last sm:order-first">
        Total {total} items
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-6 lg:gap-8">
        <div className="flex items-center gap-8 sm:gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">Rows</p>
            <Select
              value={`${limit}`}
              onValueChange={(value) => {
                onLimitChange(Number(value));
              }}
            >
              <SelectTrigger className="h-9 w-17.5 sm:h-8">
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center text-sm font-semibold min-w-20 whitespace-nowrap">
            Page {page} of {pages}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-9 w-9 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0 sm:h-9 sm:w-9"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0 sm:h-9 sm:w-9"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-9 w-9 p-0 lg:flex"
            onClick={() => onPageChange(pages)}
            disabled={page >= pages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
