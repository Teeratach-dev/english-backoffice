import { Button, ButtonProps } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CancelButtonProps extends ButtonProps {
  label?: string;
}

export function CancelButton({
  label = "Cancel",
  className,
  variant = "outline",
  ...props
}: CancelButtonProps) {
  return (
    <Button variant={variant} className={cn("gap-2", className)} {...props}>
      <X className="h-4 w-4 mr-0 min-[450px]:mr-1" />
      <span className="hidden min-[450px]:inline">{label}</span>
    </Button>
  );
}
