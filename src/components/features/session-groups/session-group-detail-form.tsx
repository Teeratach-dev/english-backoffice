"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionGroupFormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface SessionGroupDetailFormProps {
  form: SessionGroupFormData;
  onFormChange: (form: SessionGroupFormData) => void;
}

export function SessionGroupDetailForm({
  form,
  onFormChange,
}: SessionGroupDetailFormProps) {
  return (
    <Card>
      <CardHeader className="max-[450px]:px-3">
        <CardTitle>Session Group Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-[450px]:px-3">
        <div className="grid gap-2">
          <Label htmlFor="group-name">Group Name</Label>
          <Input
            id="group-name"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Enter group name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="group-desc">Description</Label>
          <Textarea
            id="group-desc"
            value={form.description}
            onChange={(e) =>
              onFormChange({ ...form, description: e.target.value })
            }
            placeholder="Enter group description"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="group-active"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              onFormChange({ ...form, isActive: checked })
            }
          />
          <Label htmlFor="group-active">Active Status</Label>
        </div>
      </CardContent>
    </Card>
  );
}
