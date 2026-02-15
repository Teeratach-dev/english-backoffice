import { MatchCardAction, Action } from "@/types/action.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

interface MatchCardActionFormProps {
  action: MatchCardAction;
  onChange: (updates: Partial<MatchCardAction>) => void;
}

export function MatchCardActionForm({
  action,
  onChange,
}: MatchCardActionFormProps) {
  const updateAction = (updates: Partial<MatchCardAction>) => {
    onChange(updates);
  };

  const handleAddPair = () => {
    updateAction({
      items: [
        ...(action.items || []),
        { left: { text: "" }, right: { text: "" } },
      ],
    });
  };

  const handleUpdateItem = (
    index: number,
    side: "left" | "right",
    field: "text" | "audioUrl",
    value: string,
  ) => {
    const items = [...(action.items || [])];
    if (!items[index]) return;

    items[index] = {
      ...items[index],
      [side]: {
        ...items[index][side],
        [field]: value,
      },
    };
    updateAction({ items });
  };

  const handleTypeChange = (
    index: number,
    side: "left" | "right",
    type: "text" | "audio",
  ) => {
    const items = [...(action.items || [])];
    if (!items[index]) return;

    const currentItem = items[index][side];

    // If specific type is selected, we clear the other one to enforce exclusivity
    if (type === "text") {
      items[index] = {
        ...items[index],
        [side]: {
          text: currentItem?.text || "",
          audioUrl: undefined,
        },
      };
    } else {
      items[index] = {
        ...items[index],
        [side]: {
          text: undefined,
          audioUrl: currentItem?.audioUrl || "",
        },
      };
    }
    updateAction({ items });
  };

  const handleDeleteItem = (index: number) => {
    const items = (action.items || []).filter((_, i) => i !== index);
    updateAction({ items });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Pairs
        </Label>
        <Button size="sm" variant="outline" onClick={handleAddPair}>
          <Plus className="h-4 w-4 mr-1" /> Add Pair
        </Button>
      </div>

      {(action.items || []).map((item, idx) => {
        const leftMode = item.left?.audioUrl !== undefined ? "audio" : "text"; // Default to text if both missing or text present
        const rightMode = item.right?.audioUrl !== undefined ? "audio" : "text";

        return (
          <div
            key={idx}
            className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded items-start relative group"
          >
            {/* Left Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[10px]">Left Side</Label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] ${leftMode === "text" ? "text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    Text
                  </span>
                  <Switch
                    checked={leftMode === "audio"}
                    onCheckedChange={(checked) =>
                      handleTypeChange(idx, "left", checked ? "audio" : "text")
                    }
                    className="h-4 w-7 bg-primary data-[state=unchecked]:bg-primary [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                  />
                  <span
                    className={`text-[10px] ${leftMode === "audio" ? "text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    Audio
                  </span>
                </div>
              </div>

              {leftMode === "text" ? (
                <Input
                  value={item.left?.text || ""}
                  onChange={(e) =>
                    handleUpdateItem(idx, "left", "text", e.target.value)
                  }
                  placeholder="Enter text..."
                  className="h-8 text-xs"
                />
              ) : (
                <Input
                  value={item.left?.audioUrl || ""}
                  onChange={(e) =>
                    handleUpdateItem(idx, "left", "audioUrl", e.target.value)
                  }
                  placeholder="Audio URL..."
                  className="h-8 text-xs"
                />
              )}
            </div>

            {/* Right Side */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between mr-6">
                <Label className="text-[10px]">Right Side</Label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] ${rightMode === "text" ? "text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    Text
                  </span>
                  <Switch
                    checked={rightMode === "audio"}
                    onCheckedChange={(checked) =>
                      handleTypeChange(idx, "right", checked ? "audio" : "text")
                    }
                    className="h-4 w-7 bg-primary data-[state=unchecked]:bg-primary [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3"
                  />
                  <span
                    className={`text-[10px] ${rightMode === "audio" ? "text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    Audio
                  </span>
                </div>
              </div>

              {rightMode === "text" ? (
                <Input
                  value={item.right?.text || ""}
                  onChange={(e) =>
                    handleUpdateItem(idx, "right", "text", e.target.value)
                  }
                  placeholder="Enter text..."
                  className="h-8 text-xs"
                />
              ) : (
                <Input
                  value={item.right?.audioUrl || ""}
                  onChange={(e) =>
                    handleUpdateItem(idx, "right", "audioUrl", e.target.value)
                  }
                  placeholder="Audio URL..."
                  className="h-8 text-xs"
                />
              )}
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-lg bg-background border shadow-sm group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteItem(idx)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      })}

      {(action.items || []).length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
          No pairs added yet. Click "Add Pair" to start.
        </div>
      )}
    </div>
  );
}
