"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnitForm } from "@/components/features/units/unit-form";

interface UnitItem {
  _id: string;
  name: string;
  courseId?: string;
  courseName?: string;
  topicCount: number;
  isActive: boolean;
  sequence: number;
  createdAt: string;
}

export default function UnitsListPage() {
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitItem | null>(null);
  const router = useRouter();

  async function fetchUnits() {
    setLoading(true);
    try {
      const res = await fetch("/api/units");
      if (!res.ok) throw new Error("Failed to fetch units");
      const result = await res.json();
      setUnits(result.data || []);
    } catch (error) {
      toast.error("Error loading units");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUnits();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this unit?")) return;
    try {
      const res = await fetch(`/api/units/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete unit");
      toast.success("Unit deleted");
      fetchUnits();
    } catch (error) {
      toast.error("Error deleting unit");
    }
  }

  const handleEdit = (unit: UnitItem) => {
    setSelectedUnit(unit);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedUnit(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedUnit(null);
    fetchUnits();
  };

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.courseName || "").toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground">
            View all units across all courses.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Unit
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search units or course name..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="max-w-[200px]">Course</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No units found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((unit) => (
                <TableRow
                  key={unit._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    if (unit.courseId) {
                      router.push(
                        `/courses/${unit.courseId}/units/${unit._id}/topics`,
                      );
                    }
                  }}
                >
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {unit.courseName || "—"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
                      {unit.topicCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        unit.isActive
                          ? "bg-success text-success-foreground"
                          : "bg-error text-error-foreground"
                      }`}
                    >
                      {unit.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(unit.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className="text-right space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(unit._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
            courseId={selectedUnit?.courseId} // Pass courseId if editing
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
