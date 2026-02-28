import { Button, ButtonProps } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteButtonProps extends ButtonProps {
  label?: string;
}

export function DeleteButton({
  label = "Delete",
  className,
  variant = "ghost",
  ...props
}: DeleteButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        "gap-2 text-muted-foreground/60 hover:bg-destructive hover:text-destructive-foreground border",
        className,
      )}
      {...props}
    >
      <Trash2 className="h-4 w-4" />
      <span className="hidden min-[450px]:inline">{label}</span>
    </Button>
  );
}
