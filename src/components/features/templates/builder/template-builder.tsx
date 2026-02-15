"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Action,
  ActionType,
  getDefaultContent,
  Screen,
} from "@/types/action.types";
import { SortableScreenCard } from "@/components/features/sessions/builder/sortable-screen-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SESSION_TYPES, SESSION_TYPE_LABELS } from "@/types/action.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StickyFooter } from "@/components/layouts/sticky-footer";

interface TemplateBuilderProps {
  initialData?: any;
}

export function TemplateBuilder({ initialData }: TemplateBuilderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "reading");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Transform initial screens if necessary.
  // Template screens usually store action types, but SortableScreenCard expects full Action objects.
  // We need to map them.
  const [screens, setScreens] = useState<Screen[]>(
    (initialData?.screens || []).map((s: any, sIdx: number) => ({
      id: `scr-${sIdx}-${Date.now()}`,
      sequence: sIdx,
      actions: (s.actions || s.actionTypes || []).map(
        (a: any, aIdx: number) => {
          // Handle both full action objects (if any) or just type strings
          const actionType = typeof a === "string" ? a : a.type;
          return {
            id: `act-${sIdx}-${aIdx}-${Date.now()}`,
            ...getDefaultContent(actionType as ActionType),
            sequence: aIdx,
          };
        },
      ),
    })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleScreenDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setScreens((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  const addScreen = () => {
    setScreens([
      ...screens,
      {
        id: `scr-${Date.now()}`,
        sequence: screens.length,
        actions: [],
      },
    ]);
  };

  const deleteScreen = (id: string) => {
    setScreens(screens.filter((s) => s.id !== id));
  };

  const addActionToScreen = (screenId: string, type: ActionType) => {
    setScreens(
      screens.map((s) => {
        if (s.id === screenId) {
          return {
            ...s,
            actions: [
              ...s.actions,
              {
                id: `act-${Date.now()}`,
                ...getDefaultContent(type),
                sequence: s.actions.length,
              } as Action & { id: string; sequence: number },
            ],
          };
        }
        return s;
      }),
    );
  };

  const deleteAction = (screenId: string, actionId: string) => {
    setScreens(
      screens.map((s) => {
        if (s.id === screenId) {
          return { ...s, actions: s.actions.filter((a) => a.id !== actionId) };
        }
        return s;
      }),
    );
  };

  const reorderActions = (
    screenId: string,
    activeId: string,
    overId: string,
  ) => {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          const oldIndex = s.actions.findIndex((a) => a.id === activeId);
          const newIndex = s.actions.findIndex((a) => a.id === overId);
          return { ...s, actions: arrayMove(s.actions, oldIndex, newIndex) };
        }
        return s;
      }),
    );
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Template name is required");
      return;
    }

    setLoading(true);
    try {
      const templateData = {
        name,
        type,
        isActive,
        screens: screens.map((s, sIdx) => ({
          sequence: sIdx,
          // For template, we ideally only save action types?
          // But consistency with session structure might be good?
          // The API/Schema expects what?
          // Checking Schema... typically templates save minimal data.
          // But let's assume we save minimal: actionTypes maps to array of strings or objects?
          // Looking at SessionBuilder's save template logic:
          /*
            screens: screens.map((s, sIdx) => ({
              sequence: sIdx,
              actionTypes: s.actions.map((a) => a.type),
            })),
          */
          // So we should save `actionTypes`.
          actionTypes: s.actions.map((a) => a.type),
          // NOTE: If the backend schema for template expects `screens` array with `actionTypes` array of strings.
        })),
      };

      const url = initialData?._id
        ? `/api/templates/${initialData._id}`
        : "/api/templates";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });

      if (!res.ok) throw new Error("Failed to save template");
      toast.success("Template saved successfully");
      router.push("/session-templates");
    } catch (error) {
      toast.error("Error saving template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 space-y-6">
      <div className="grid gap-4 py-4 border rounded-lg p-4 bg-card">
        <div className="grid gap-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template Name"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {SESSION_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-6 mb-4">
        <h2 className="text-xl font-semibold">Screens Structure</h2>
        <div className="ml-auto">
          <Button onClick={addScreen} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Screen
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleScreenDragEnd}
        >
          <SortableContext
            items={screens.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {screens.map((screen, sIdx) => (
              <SortableScreenCard
                key={screen.id}
                screen={screen}
                sIdx={sIdx}
                activeActionId={null} // No active action editing
                onDelete={() => deleteScreen(screen.id)}
                onAddAction={(type) => addActionToScreen(screen.id, type)}
                onDeleteAction={(actionId) => deleteAction(screen.id, actionId)}
                onEditAction={() => {}} // No editing content
                onReorderActions={(activeId, overId) =>
                  reorderActions(screen.id, activeId, overId)
                }
                onUpdateAction={() => {}} // No updating content
                showPreview={false} // No preview in template builder
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <StickyFooter>
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Template"}
        </Button>
      </StickyFooter>
    </div>
  );
}
