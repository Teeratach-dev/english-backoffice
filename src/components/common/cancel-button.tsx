import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
}

export function CancelButton({
  label = "Cancel",
  className,
  ...props
}: CancelButtonProps) {
  return (
    <Button variant="outline" className={cn("gap-2", className)} {...props}>
      <X className="h-4 w-4 mr-0 min-[450px]:mr-1" />
      <span className="hidden min-[450px]:inline">{label}</span>
    </Button>
  );
}
