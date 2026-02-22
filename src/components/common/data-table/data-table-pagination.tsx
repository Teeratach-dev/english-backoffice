"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Pagination } from "../../../types/pagination.types";

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
  const { page, limit, pages } = pagination;

  return (
    <div className="flex flex-wrap items-center justify-center min-[800px]:justify-start gap-6 px-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium whitespace-nowrap">Per Page</p>
        <Select
          value={`${limit}`}
          onValueChange={(value: any) => {
            onLimitChange(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-17.5">
            <SelectValue placeholder={limit.toString()} />
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

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-8 w-8 items-center justify-center text-sm font-medium border rounded-md">
          {page}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
