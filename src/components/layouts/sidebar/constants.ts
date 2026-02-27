import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  Users,
  Settings,
  Folder,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItemConfig {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

export const sidebarItems: SidebarItemConfig[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    name: "Courses",
    href: "/courses",
    icon: BookOpen,
    isActive: (pathname: string) => pathname.startsWith("/courses"),
  },
  {
    name: "Units",
    href: "/units",
    icon: Layers,
    isActive: (pathname: string) => pathname.startsWith("/units"),
  },
  {
    name: "Topics",
    href: "/topics",
    icon: FileText,
    isActive: (pathname: string) => pathname.startsWith("/topics"),
  },
  {
    name: "Session Groups",
    href: "/session-groups",
    icon: Folder,
    isActive: (pathname: string) => pathname.startsWith("/session-groups"),
  },
  {
    name: "Session Details",
    href: "/sessions",
    icon: ListChecks,
    isActive: (pathname: string) => pathname.startsWith("/sessions"),
  },
  {
    name: "Session Templates",
    href: "/session-templates",
    icon: Settings,
    isActive: (pathname: string) => pathname.startsWith("/session-templates"),
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    isActive: (pathname: string) => pathname.startsWith("/users"),
  },
];
