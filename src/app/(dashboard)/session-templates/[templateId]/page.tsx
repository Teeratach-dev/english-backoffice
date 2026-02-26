"use client";

import { useEffect, useState, use } from "react";
import { TemplateBuilder } from "@/components/features/session-templates/builder/template-builder";
import { PageHeader } from "@/components/layouts/page-header";
import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isNew = templateId === "new";

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    async function fetchTemplate() {
      try {
        const res = await fetch(`/api/templates/${templateId}`);
        if (!res.ok) throw new Error("Failed to fetch template");
        const data = await res.json();
        setTemplate(data);
      } catch (error) {
        toast.error("Error loading template");
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [templateId, isNew]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={isNew ? "Create Template" : "Edit Template"} />
      <Breadcrumb
        items={[
          { label: "Session Templates", href: "/session-templates" },
          { label: isNew ? "Create" : template?.name || "Edit", href: "#" },
        ]}
      />
      <TemplateBuilder initialData={template} />
    </div>
  );
}
