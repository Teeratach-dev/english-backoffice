"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseFormData {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  purchaseable: boolean;
}

interface CourseDetailFormProps {
  form: CourseFormData;
  onFormChange: (form: CourseFormData) => void;
}

export function CourseDetailForm({
  form,
  onFormChange,
}: CourseDetailFormProps) {
  return (
    <Card>
      <CardHeader className="max-[450px]:px-3">
        <CardTitle>Course Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-[450px]:px-3">
        <div className="grid gap-2">
          <Label htmlFor="course-name">Course Name</Label>
          <Input
            id="course-name"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Enter course name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="course-desc">Description</Label>
          <Textarea
            id="course-desc"
            value={form.description}
            onChange={(e) =>
              onFormChange({ ...form, description: e.target.value })
            }
            placeholder="Enter course description"
            rows={3}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="course-price">Price</Label>
          <Input
            id="course-price"
            type="number"
            value={form.price}
            onChange={(e) =>
              onFormChange({ ...form, price: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-wrap gap-6 mt-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="course-active"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                onFormChange({ ...form, isActive: checked })
              }
            />
            <Label htmlFor="course-active">Active Status</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="course-purchase"
              checked={form.purchaseable}
              onCheckedChange={(checked) =>
                onFormChange({ ...form, purchaseable: checked })
              }
            />
            <Label htmlFor="course-purchase">Purchaseable</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
