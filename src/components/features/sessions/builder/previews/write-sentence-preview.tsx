import {
  ActionType,
  WriteSentenceAction,
  WriteSentenceInChatAction,
} from "@/types/action.types";
import { cn } from "@/lib/utils";

interface WriteSentencePreviewProps {
  action: WriteSentenceAction | WriteSentenceInChatAction;
}

export function WriteSentencePreview({ action }: WriteSentencePreviewProps) {
  const sentence = action.sentence?.join(" ") || "Type your sentence here...";

  if (action.type === ActionType.WriteSentence) {
    return (
      <div className="p-8 border rounded-lg bg-background shadow-lg max-w-sm mx-auto relative overflow-hidden group">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
        <p className="text-sm font-medium text-foreground leading-relaxed italic">
          {sentence}
        </p>
      </div>
    );
  }

  const isRight = action.position === "right";

  return (
    <div className="p-8 border rounded-lg bg-background shadow-lg max-w-sm mx-auto space-y-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div
        className={cn(
          "flex items-end gap-3 animate-in slide-in-from-bottom-2 duration-500",
          isRight ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div className="shrink-0 flex flex-col items-center self-end">
          <div
            className={cn(
              "h-10 w-10 rounded-full overflow-hidden  shadow-md transition-transform duration-300 hover:scale-105",
              isRight
                ? "bg-blue-100  ring-2 ring-blue-50/50"
                : "bg-purple-100  ring-2 ring-purple-50/50",
            )}
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${isRight ? "User" : "Lily"}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[8px] mt-1.5 font-bold text-muted-foreground uppercase tracking-widest text-center truncate w-10">
            {isRight ? "You" : "Lily"}
          </span>
        </div>

        <div
          className={cn(
            "p-4 border-2 border-orange-400/40 rounded-2xl bg-orange-50/30 dark:bg-orange-950/10 backdrop-blur-sm shadow-xs transition-all duration-300 hover:border-orange-400/60 flex-1",
            isRight ? "rounded-br-none" : "rounded-bl-none",
          )}
        >
          <p className="text-xs font-medium text-foreground leading-relaxed italic">
            {sentence}
          </p>
        </div>
      </div>
    </div>
  );
}
