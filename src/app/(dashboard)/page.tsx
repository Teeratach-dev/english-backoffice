import { PageHeader } from "@/components/layouts/page-header";
import { getDashboardStats } from "@/services/dashboard.service";
import {
  Users,
  BookOpen,
  Library,
  Layers,
  FileText,
  Layout,
} from "lucide-react";
import { StatCard } from "@/components/features/dashboard/stat-card";

export default async function DashboardPage() {
  const {
    totalUsers,
    activeCourses,
    activeTopics,
    activeSessionGroups,
    activeSessions,
    activeSessionTemplates,
  } = await getDashboardStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader title="Dashboard" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers ?? 0}
          description="Total registered users"
          icon={<Users />}
        />
        <StatCard
          title="Active Courses"
          value={activeCourses ?? 0}
          description="Courses currently active"
          icon={<BookOpen />}
        />
        <StatCard
          title="Topics"
          value={activeTopics ?? 0}
          description="Total available topics"
          icon={<Library />}
        />
        <StatCard
          title="Session Groups"
          value={activeSessionGroups ?? 0}
          description="Groups for sessions"
          icon={<Layers />}
        />
        <StatCard
          title="Session Details"
          value={activeSessions ?? 0}
          description="Active session instances"
          icon={<FileText />}
        />
        <StatCard
          title="Session Templates"
          value={activeSessionTemplates ?? 0}
          description="Base session templates"
          icon={<Layout />}
        />
      </div>
    </div>
  );
}
