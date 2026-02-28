"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { SESSION_TYPES, SESSION_TYPE_LABELS } from "@/types/action.types";
import { useState, useEffect } from "react";

interface Template {
  _id: string;
  name: string;
  type: string;
  isActive?: boolean;
  screens: any[];
}


export function LoadTemplateDialog({
  open,
  onOpenChange,
  templates,
  onApplyTemplate,
  onFetch,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  onApplyTemplate: (template: Template) => void;
  onFetch: (filters: { isActive: boolean; type: string }) => void;
  loading: boolean;
}) {
  const [isActive, setIsActive] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    if (open) {
      onFetch({ isActive, type: selectedType });
    }
  }, [open, isActive, selectedType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Load from Template</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Type:</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {SESSION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {SESSION_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="active-filter"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <label
              htmlFor="active-filter"
              className="text-sm font-medium cursor-pointer"
            >
              Active Only
            </label>
          </div>
        </div>

        <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Spinner />
            </div>
          ) : templates.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No templates found matching filters.
            </p>
          ) : (
            templates.map((template) => (
              <div
                key={template._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                onClick={() => onApplyTemplate(template)}
              >
                <div>
                  <h4 className="font-semibold text-sm">{template.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase px-1.5 py-0.5 rounded bg-muted font-bold">
                      {template.type}
                    </span>
                    <span>{template.screens.length} Screens</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Apply
                </Button>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
