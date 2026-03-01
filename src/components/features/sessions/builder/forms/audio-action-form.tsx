"use client";

import { AudioAction } from "@/types/action.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AudioActionFormProps {
  action: AudioAction;
  onChange: (updates: Partial<AudioAction>) => void;
}

/**
 * AudioActionForm Component
 *
 * ฟอร์มสำหรับแก้ไขข้อมูลของ Audio Action ตามหลัก SOLID และการแยกส่วนประกอบ
 */
export function AudioActionForm({ action, onChange }: AudioActionFormProps) {
  function handleChange(updates: Partial<AudioAction>) {
    onChange(updates);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="audio"
          className="text-xs font-medium text-muted-foreground"
        >
          Audio URL
        </Label>
        <Input
          id="audio"
          placeholder="https://example.com/audio.mp3"
          value={action.audio || ""}
          onChange={(e) => handleChange({ audio: e.target.value })}
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
}
