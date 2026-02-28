"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicFormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface TopicDetailFormProps {
  form: TopicFormData;
  onFormChange: (form: TopicFormData) => void;
}

export function TopicDetailForm({ form, onFormChange }: TopicDetailFormProps) {
  return (
    <Card>
      <CardHeader className="max-[450px]:px-3">
        <CardTitle>Topic Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-[450px]:px-3">
        <div className="grid gap-2">
          <Label htmlFor="topic-name">Topic Name</Label>
          <Input
            id="topic-name"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Enter topic name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="topic-desc">Description</Label>
          <Textarea
            id="topic-desc"
            value={form.description}
            onChange={(e) =>
              onFormChange({ ...form, description: e.target.value })
            }
            placeholder="Enter topic description"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="topic-active"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              onFormChange({ ...form, isActive: checked })
            }
          />
          <Label htmlFor="topic-active">Active Status</Label>
        </div>
      </CardContent>
    </Card>
  );
}
