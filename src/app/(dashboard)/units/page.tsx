"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnitForm } from "@/components/features/units/unit-form";
import { UnitTable, UnitItem } from "@/components/features/units/unit-table";
import { PageHeader } from "@/components/layouts/page-header";

export default function UnitsListPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEdit(unit: UnitItem) {
    setSelectedUnit(unit);
    setIsDialogOpen(true);
  }

  function handleAdd() {
    setSelectedUnit(null);
    setIsDialogOpen(true);
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedUnit(null);
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Units" />

      <UnitTable
        key={refreshKey}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUnit ? "Edit Unit" : "Add New Unit"}
            </DialogTitle>
          </DialogHeader>
          <UnitForm
            initialData={selectedUnit}
            onSuccess={handleSuccess}
            courseId={selectedUnit?.courseId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
