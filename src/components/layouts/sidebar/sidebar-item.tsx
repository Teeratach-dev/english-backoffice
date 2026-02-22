import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { type SidebarItemConfig } from "./constants";

interface SidebarItemProps {
  item: SidebarItemConfig;
  pathname: string;
  isOpen: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({
  item,
  pathname,
  isOpen,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon;
  const active = item.isActive(pathname);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={!isOpen ? item.name : undefined}
      className={cn(
        buttonVariants({
          variant: active ? "secondary" : "ghost",
        }),
        "w-full justify-start whitespace-nowrap overflow-hidden transition-all duration-300",
        !isOpen && "justify-center px-2",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isOpen && "mr-2")} />
      <span
        className={cn(
          "transition-all duration-300 overflow-hidden",
          !isOpen ? "opacity-0 w-0" : "opacity-100",
        )}
      >
        {item.name}
      </span>
    </Link>
  );
}
