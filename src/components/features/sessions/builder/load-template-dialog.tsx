"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Template {
  _id: string;
  name: string;
  screens: any[];
}

interface LoadTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  onApplyTemplate: (template: Template) => void;
}

export function LoadTemplateDialog({
  open,
  onOpenChange,
  templates,
  onApplyTemplate,
}: LoadTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Load from Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
          {templates.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No templates found for this session type.
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
                  <p className="text-xs text-muted-foreground">
                    {template.screens.length} Screens
                  </p>
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
