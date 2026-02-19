import { Button, ButtonProps } from "@/components/ui/button";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface SaveButtonProps extends ButtonProps {
  label?: string;
  loadingLabel?: string;
  loading?: boolean;
}

export function SaveButton({
  label = "Save Changes",
  loadingLabel = "Saving...",
  loading = false,
  className,
  variant = "default",
  ...props
}: SaveButtonProps) {
  return (
    <Button
      variant={variant}
      disabled={loading || props.disabled}
      className={cn("min-w-10 min-[450px]:min-w-25 gap-2", className)}
      {...props}
    >
      <Save className="h-4 w-4 mr-0 min-[450px]:mr-1" />
      <span className="hidden min-[450px]:inline">
        {loading ? loadingLabel : label}
      </span>
    </Button>
  );
}
