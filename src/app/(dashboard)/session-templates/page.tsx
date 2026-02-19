"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TemplateTable,
  TemplateItem,
} from "@/components/features/templates/template-table";
import { PageHeader } from "@/components/layouts/page-header";
import { Breadcrumb } from "@/components/layouts/breadcrumb";

export default function SessionTemplatesPage() {
  const router = useRouter();

  const handleEdit = (template: TemplateItem) => {
    router.push(`/session-templates/${template._id}`);
  };

  const handleAdd = () => {
    router.push("/session-templates/new");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Session Templates" />
      <Breadcrumb items={[{ label: "Session Templates", href: "#" }]} />

      <TemplateTable
        onEdit={handleEdit}
        addButton={
          <Button
            onClick={handleAdd}
            className="h-10 w-10 px-0 min-[450px]:w-auto min-[450px]:px-4"
          >
            <Plus className="h-4 w-4 mr-0 min-[450px]:mr-2" />
            <span className="hidden min-[450px]:inline">Add</span>
          </Button>
        }
      />
    </div>
  );
}
