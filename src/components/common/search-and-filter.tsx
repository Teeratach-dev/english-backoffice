"use client";

import { useEffect, useState } from "react";
import { Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string; // unique key for the filter group (e.g. "status", "role")
  title: string; // display title (e.g. "Status", "Role")
  options: FilterOption[];
  allowMultiple?: boolean; // default false
}

interface SearchAndFilterProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterGroup[];
  activeFilters?: Record<string, string[]>; // Map filter key to selected values array
  onFilterChange?: (key: string, values: string[]) => void;
  children?: React.ReactNode; // For additional actions (e.g. Add Button)
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  children,
}: SearchAndFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Default to first filter tab if available
  const [activeTab, setActiveTab] = useState(filters[0]?.key || "");

  // Update active tab if filters change
  useEffect(() => {
    if (filters.length > 0 && !activeTab) {
      setActiveTab(filters[0].key);
    }
  }, [filters, activeTab]);

  const handleCheckboxChange = (
    groupKey: string,
    value: string,
    checked: boolean | "indeterminate",
  ) => {
    if (!onFilterChange) return;

    const currentValues = activeFilters[groupKey] || [];
    const group = filters.find((f) => f.key === groupKey);
    const allowMultiple = group?.allowMultiple ?? false;

    let newValues: string[];

    if (checked === true) {
      if (allowMultiple) {
        newValues = [...currentValues, value];
      } else {
        newValues = [value];
      }
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    onFilterChange(groupKey, newValues);
  };

  const handleSelectAll = (
    groupKey: string,
    checked: boolean | "indeterminate",
  ) => {
    if (!onFilterChange) return;
    const group = filters.find((f) => f.key === groupKey);
    if (!group) return;

    if (checked === true) {
      onFilterChange(
        groupKey,
        group.options.map((o) => o.value),
      );
    } else {
      onFilterChange(groupKey, []);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(activeFilters).forEach((values) => {
      if (values && values.length > 0) count += 1;
    });
    return count;
  };

  return (
    <div className="flex items-center gap-2 w-full min-[450px]:w-auto min-[450px]:flex-wrap">
      <div className="relative flex-1 min-w-0 w-full min-[450px]:w-auto min-[450px]:min-w-45 min-[450px]:max-w-lg">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search ..."
          className="pl-8 w-full"
          value={searchQuery || ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {filters.length > 0 && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-dashed focus:border-solid focus:ring-2 focus:ring-ring focus:ring-offset-0 data-[state=open]:border-solid data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-0 shrink-0 h-10 w-10 px-0 min-[450px]:w-auto min-[450px]:px-4 relative"
            >
              <ListFilter className="h-4 w-4" />
              <span className="hidden min-[450px]:inline">Filters</span>
              {getActiveFilterCount() > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 min-[450px]:static min-[450px]:ml-1 h-5 w-5 min-[450px]:w-auto p-0 min-[450px]:px-1.5 flex items-center justify-center rounded-full min-[450px]:rounded-md lg:hidden"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[calc(100vw-32px)] min-[450px]:w-[400px] p-0 mr-4 min-[450px]:mr-6"
            align="start"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex flex-col gap-2 border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-2 py-1 text-xs text-primary hover:bg-primary/10"
                      onClick={() => {
                        filters.forEach((f) => onFilterChange?.(f.key, []));
                      }}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                  {filters.map((filter) => {
                    const isActive =
                      (activeFilters[filter.key]?.length || 0) > 0;
                    return (
                      <TabsTrigger
                        key={filter.key}
                        value={filter.key}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          isActive &&
                            "border-primary bg-primary/10 text-primary hover:bg-primary/20",
                        )}
                      >
                        {filter.title}
                        {isActive && (
                          <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {activeFilters[filter.key]?.length}
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {filters.map((filter) => (
                <TabsContent
                  key={filter.key}
                  value={filter.key}
                  className="mt-0 max-h-[60vh] min-[450px]:max-h-[300px] overflow-y-auto px-4 py-2"
                >
                  <div className="mb-2 flex items-center justify-between sticky top-0 pt-2 pb-2 z-10">
                    <span className="text-sm font-medium text-muted-foreground">
                      Select options
                    </span>
                    {filter.allowMultiple && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          Select All
                        </span>
                        <Checkbox
                          checked={
                            activeFilters[filter.key]?.length ===
                              filter.options.length && filter.options.length > 0
                          }
                          onCheckedChange={(
                            checked: boolean | "indeterminate",
                          ) => handleSelectAll(filter.key, checked)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 pb-2">
                    {filter.options.map((option) => {
                      const isSelected = (
                        activeFilters[filter.key] || []
                      ).includes(option.value);
                      return (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors"
                          onClick={() =>
                            handleCheckboxChange(
                              filter.key,
                              option.value,
                              !isSelected,
                            )
                          }
                        >
                          <Checkbox
                            id={`${filter.key}-${option.value}`}
                            checked={isSelected}
                            onCheckedChange={(
                              checked: boolean | "indeterminate",
                            ) =>
                              handleCheckboxChange(
                                filter.key,
                                option.value,
                                checked,
                              )
                            }
                          />
                          <label
                            htmlFor={`${filter.key}-${option.value}`}
                            className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {option.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </PopoverContent>
        </Popover>
      )}
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
