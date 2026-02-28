"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UnitFormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface UnitDetailFormProps {
  form: UnitFormData;
  onFormChange: (form: UnitFormData) => void;
}

export function UnitDetailForm({ form, onFormChange }: UnitDetailFormProps) {
  return (
    <Card>
      <CardHeader className="max-[450px]:px-3">
        <CardTitle>Unit Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-[450px]:px-3">
        <div className="grid gap-2">
          <Label htmlFor="unit-name">Unit Name</Label>
          <Input
            id="unit-name"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Enter unit name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="unit-desc">Description</Label>
          <Textarea
            id="unit-desc"
            value={form.description}
            onChange={(e) =>
              onFormChange({ ...form, description: e.target.value })
            }
            placeholder="Enter unit description"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="unit-active"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              onFormChange({ ...form, isActive: checked })
            }
          />
          <Label htmlFor="unit-active">Active Status</Label>
        </div>
      </CardContent>
    </Card>
  );
}
