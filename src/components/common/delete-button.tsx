import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
}

export function DeleteButton({
  label = "Delete",
  className,
  ...props
}: DeleteButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "gap-2 text-muted-foreground/60 hover:bg-destructive hover:text-destructive-foreground",
        className,
      )}
      {...props}
    >
      <Trash2 className="h-4 w-4" />
      <span className="hidden min-[450px]:inline">{label}</span>
    </Button>
  );
}
