"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onSave: (overwriteId?: string) => void;
  saving: boolean;
  templates: Template[];
  onFetch: (filters: { isActive: boolean; type: string }) => void;
  loading: boolean;
}

export function SaveTemplateDialog({
  open,
  onOpenChange,
  templateName,
  onTemplateNameChange,
  onSave,
  saving,
  templates,
  onFetch,
  loading,
}: SaveTemplateDialogProps) {
  const [isActive, setIsActive] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      onFetch({ isActive, type: selectedType });
      setSelectedTemplateId(null);
    }
  }, [open, isActive, selectedType]);

  const handleTemplateSelect = (template: Template) => {
    if (selectedTemplateId === template._id) {
      // Deselect
      setSelectedTemplateId(null);
      onTemplateNameChange("");
    } else {
      setSelectedTemplateId(template._id);
      onTemplateNameChange(template.name);
    }
  };

  const handleNameChange = (name: string) => {
    onTemplateNameChange(name);
    if (selectedTemplateId) {
      // If user types, and it doesn't match selected, deselect?
      // Or keep selected to rename? Let's keep selected for now, but if they want to create new, they should probably clear selection.
      // Actually, let's keep it simple: if typed name matches a template, select it? No, explicit selection is better.
      // If they change name, it's still an overwrite content-wise but with new name? Or rename?
      // Let's assume overwrite updates everything including name if changed.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. standard Reading Session"
            />
            {selectedTemplateId && (
              <p className="text-xs text-yellow-600 font-medium">
                Warning: This will overwrite the selected template.
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 py-2 border-t pt-4">
            <span className="text-sm font-semibold text-muted-foreground w-full">
              Or overwrite existing:
            </span>
          </div>

          <div className="flex items-center gap-4">
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
                id="save-active-filter"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <label
                htmlFor="save-active-filter"
                className="text-sm font-medium cursor-pointer"
              >
                Active Only
              </label>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto min-h-[150px] border rounded-md p-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner />
              </div>
            ) : templates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No templates found.
              </p>
            ) : (
              templates.map((template) => (
                <div
                  key={template._id}
                  className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
                    selectedTemplateId === template._id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="uppercase px-1.5 py-0.5 rounded bg-muted font-bold">
                        {template.type}
                      </span>
                      <span>{template.screens.length} Screens</span>
                    </div>
                  </div>
                  {selectedTemplateId === template._id && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Selected
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(selectedTemplateId || undefined)}
            disabled={saving || !templateName}
          >
            {saving
              ? "Saving..."
              : selectedTemplateId
                ? "Overwrite"
                : "Create New"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
