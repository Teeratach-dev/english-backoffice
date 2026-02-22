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

// Helper to check if a segment exists AND is followed by another segment (path continues deeper)
export function isRecursiveSegment(pathname: string, segment: string) {
  const parts = pathname.split("/").filter(Boolean);
  const index = parts.indexOf(segment);
  // Returns true only if segment is found AND it is NOT the last part
  return index !== -1 && index < parts.length - 1;
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
    isActive: (pathname: string) =>
      pathname.startsWith("/courses") && !isRecursiveSegment(pathname, "units"),
  },
  {
    name: "Units",
    href: "/units",
    icon: Layers,
    isActive: (pathname: string) =>
      (pathname.startsWith("/units") ||
        isRecursiveSegment(pathname, "units")) &&
      !isRecursiveSegment(pathname, "topics"),
  },
  {
    name: "Topics",
    href: "/topics",
    icon: FileText,
    isActive: (pathname: string) =>
      (pathname.startsWith("/topics") ||
        isRecursiveSegment(pathname, "topics")) &&
      !isRecursiveSegment(pathname, "groups"),
  },
  {
    name: "Session Groups",
    href: "/session-groups",
    icon: Folder,
    isActive: (pathname: string) =>
      (pathname.startsWith("/session-groups") ||
        isRecursiveSegment(pathname, "groups")) &&
      !isRecursiveSegment(pathname, "sessions"),
  },
  {
    name: "Session Details",
    href: "/sessions",
    icon: ListChecks,
    isActive: (pathname: string) =>
      pathname.startsWith("/sessions") ||
      isRecursiveSegment(pathname, "sessions"),
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
