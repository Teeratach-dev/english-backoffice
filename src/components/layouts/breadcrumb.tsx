"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Auto-generate readable labels from URL segments
function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname();

  // Build breadcrumb items from URL if not provided manually
  const breadcrumbItems: BreadcrumbItem[] =
    items ||
    (() => {
      const segments = pathname.split("/").filter(Boolean);
      const result: BreadcrumbItem[] = [];
      let currentPath = "";

      for (const segment of segments) {
        currentPath += `/${segment}`;

        // Skip MongoDB ObjectId-like segments (24 hex chars)
        if (/^[0-9a-fA-F]{24}$/.test(segment)) continue;

        result.push({
          label: formatSegment(segment),
          href: currentPath,
        });
      }

      return result;
    })();

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-sm text-muted-foreground overflow-x-auto whitespace-nowrap no-scrollbar",
        className,
      )}
    >
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <span key={item.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1.5 shrink-0" />
            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-50">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors truncate max-w-50"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
