"use client";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[type=success]:!bg-success data-[type=success]:!text-success-foreground data-[type=success]:!border-success data-[type=error]:!bg-error data-[type=error]:!text-error-foreground data-[type=error]:!border-error data-[type=warning]:!bg-warning data-[type=warning]:!text-warning-foreground data-[type=warning]:!border-warning data-[type=info]:!bg-info data-[type=info]:!text-info-foreground data-[type=info]:!border-info",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
