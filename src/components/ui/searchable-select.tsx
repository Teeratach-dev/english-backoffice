"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  fetchOptions: (
    search: string,
    page: number,
  ) => Promise<{ data: Option[]; hasMore: boolean }>;
  className?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  fetchOptions,
  className,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [selectedLabel, setSelectedLabel] = React.useState<string>("");

  const loadOptions = React.useCallback(
    async (
      currentSearch: string,
      currentPage: number,
      isNewSearch: boolean,
    ) => {
      setLoading(true);
      try {
        const result = await fetchOptions(currentSearch, currentPage);
        if (isNewSearch) {
          setOptions(result.data);
        } else {
          setOptions((prev) => [...prev, ...result.data]);
        }
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions],
  );

  React.useEffect(() => {
    if (open) {
      setSearch("");
      setPage(1);
      loadOptions("", 1, true);
    }
  }, [open, loadOptions]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (open) {
        setPage(1);
        loadOptions(search, 1, true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, open, loadOptions]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(search, nextPage, false);
    }
  };

  const handleSelect = (option: Option) => {
    onValueChange(option.value);
    setSelectedLabel(option.label);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled}
        >
          <span className="truncate">
            {value ? selectedLabel || "Selected" : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>{placeholder}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-3 pb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none focus-visible:ring-0 px-0"
          />
        </div>
        <ScrollArea className="h-72">
          <div className="p-2">
            {options.length === 0 && !loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
            {options.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => handleSelect(option)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.label}
              </Button>
            ))}
            {hasMore && (
              <Button
                variant="ghost"
                className="w-full mt-2 text-xs text-muted-foreground"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Load more..."
                )}
              </Button>
            )}
            {loading && options.length === 0 && (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto opacity-50" />
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
