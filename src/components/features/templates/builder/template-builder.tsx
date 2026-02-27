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
  SESSION_TYPES,
  SESSION_TYPE_LABELS,
} from "@/types/action.types";
import { SortableScreenCard } from "@/components/features/sessions/builder/sortable-screen-card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StickyFooter } from "@/components/layouts/sticky-footer";
import { SaveButton } from "@/components/common/save-button";

interface TemplateBuilderProps {
  initialData?: any;
}

function transformInitialScreens(
  initialData: any,
): (Screen & { isCollapsed?: boolean })[] {
  const rawScreens = initialData?.screens || [];
  return rawScreens.map((s: any, sIdx: number) => ({
    id: `scr-${sIdx}-${Date.now()}`,
    sequence: sIdx,
    isCollapsed: false,
    actions: (s.actions || s.actionTypes || []).map((a: any, aIdx: number) => {
      const actionType = typeof a === "string" ? a : a.type;
      return {
        id: `act-${sIdx}-${aIdx}-${Date.now()}`,
        ...getDefaultContent(actionType as ActionType),
        sequence: aIdx,
      };
    }),
  }));
}

export function TemplateBuilder({ initialData }: TemplateBuilderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "reading");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [screens, setScreens] = useState<
    (Screen & { isCollapsed?: boolean })[]
  >(transformInitialScreens(initialData));

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

  function moveScreen(index: number, direction: "up" | "down") {
    setScreens((prev) => {
      const newScreens = [...prev];
      if (direction === "up" && index > 0) {
        [newScreens[index], newScreens[index - 1]] = [
          newScreens[index - 1],
          newScreens[index],
        ];
      } else if (direction === "down" && index < newScreens.length - 1) {
        [newScreens[index], newScreens[index + 1]] = [
          newScreens[index + 1],
          newScreens[index],
        ];
      }
      return newScreens;
    });
  }

  function addScreen() {
    setScreens([
      ...screens,
      {
        id: `scr-${Date.now()}`,
        sequence: screens.length,
        isCollapsed: false,
        actions: [],
      },
    ]);
  }

  function deleteScreen(id: string) {
    setScreens((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleScreenCollapse(id: string) {
    setScreens((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isCollapsed: !s.isCollapsed } : s,
      ),
    );
  }

  function toggleAllScreens(collapse: boolean) {
    setScreens((prev) => prev.map((s) => ({ ...s, isCollapsed: collapse })));
  }

  function addActionToScreen(screenId: string, actionType: ActionType) {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          return {
            ...s,
            actions: [
              ...s.actions,
              {
                id: `act-${Date.now()}`,
                ...getDefaultContent(actionType),
                sequence: s.actions.length,
              } as Action & { id: string; sequence: number },
            ],
          };
        }
        return s;
      }),
    );
  }

  function deleteAction(screenId: string, actionId: string) {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          return {
            ...s,
            actions: s.actions.filter((a) => a.id !== actionId),
          };
        }
        return s;
      }),
    );
  }

  function reorderActions(screenId: string, activeId: string, overId: string) {
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
  }

  function updateActionContent(actionId: string, updates: any) {
    setScreens((prev) =>
      prev.map((s) => ({
        ...s,
        actions: s.actions.map((a) =>
          a.id === actionId ? { ...a, ...updates } : a,
        ),
      })),
    );
  }

  async function handleSave() {
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
          actionTypes: s.actions.map((a) => a.type),
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
  }

  const areSomeScreensOpen = screens.some((s) => !s.isCollapsed);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 py-4 border rounded-lg p-4 bg-card">
        <div className="grid gap-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter template name..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
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
            <Label htmlFor="isActive" className="cursor-pointer">
              Active
            </Label>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-6 mb-4">
        <h2 className="text-xl font-semibold">Screens Structure</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAllScreens(areSomeScreensOpen)}
            disabled={screens.length === 0}
          >
            {areSomeScreensOpen ? (
              <EyeOff className="h-4 w-4 mr-0 md:mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-0 md:mr-2" />
            )}
            <span className="hidden md:inline">
              {areSomeScreensOpen ? "Collapse All" : "Expand All"}
            </span>
          </Button>
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
                activeActionId={null}
                onDelete={() => deleteScreen(screen.id)}
                onAddAction={(actionType) =>
                  addActionToScreen(screen.id, actionType)
                }
                onDeleteAction={(actionId) => deleteAction(screen.id, actionId)}
                onEditAction={() => {}}
                onReorderActions={(activeId, overId) =>
                  reorderActions(screen.id, activeId, overId)
                }
                onUpdateAction={updateActionContent}
                showPreview={false}
                onMoveUp={() => moveScreen(sIdx, "up")}
                onMoveDown={() => moveScreen(sIdx, "down")}
                isFirst={sIdx === 0}
                isLast={sIdx === screens.length - 1}
                screenNumber={sIdx + 1}
                isCollapsed={screen.isCollapsed}
                onToggleCollapse={() => toggleScreenCollapse(screen.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <StickyFooter>
        <div />
        <SaveButton
          label="Save Template"
          onClick={handleSave}
          loading={loading}
        />
      </StickyFooter>
    </div>
  );
}
