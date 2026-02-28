"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDiscardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmDiscardDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Unsaved Changes",
  description = "You have unsaved changes. Are you sure you want to leave? All changes will be lost.",
}: ConfirmDiscardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <div className="p-2 rounded-full bg-amber-500/10">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Stay on Page
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 sm:flex-none"
          >
            Discard Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
