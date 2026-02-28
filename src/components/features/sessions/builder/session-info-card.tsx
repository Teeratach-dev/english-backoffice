"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
  CEFR_LEVELS,
} from "@/types/action.types";

interface SessionFormData {
  name: string;
  type: string;
  cefrLevel: string;
  isActive: boolean;
}

interface SessionInfoCardProps {
  form: SessionFormData;
  onFormChange: (form: SessionFormData) => void;
  header: React.ReactNode;
}

export function SessionInfoCard({
  form,
  onFormChange,
  header,
}: SessionInfoCardProps) {
  return (
    <Card>
      {header}
      <CardContent className="space-y-4 p-2 max-[550px]:px-2">
        <div className="grid gap-2">
          <Label htmlFor="session-name">Session Name</Label>
          <Input
            id="session-name"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Enter session name"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="session-type">Type</Label>
            <select
              id="session-type"
              value={form.type}
              onChange={(e) =>
                onFormChange({ ...form, type: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {SESSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {
                    SESSION_TYPE_LABELS[
                      type as keyof typeof SESSION_TYPE_LABELS
                    ]
                  }
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="session-cefr">CEFR Level</Label>
            <select
              id="session-cefr"
              value={form.cefrLevel}
              onChange={(e) =>
                onFormChange({ ...form, cefrLevel: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {CEFR_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="session-active"
            checked={form.isActive}
            onCheckedChange={(checked) =>
              onFormChange({ ...form, isActive: checked })
            }
          />
          <Label htmlFor="session-active">Active Status</Label>
        </div>
      </CardContent>
    </Card>
  );
}
