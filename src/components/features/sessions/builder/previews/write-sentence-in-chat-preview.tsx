import { WriteSentenceInChatAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface WriteSentenceInChatPreviewProps {
  action: WriteSentenceInChatAction;
}

export function WriteSentenceInChatPreview({
  action,
}: WriteSentenceInChatPreviewProps) {
  const sentence = action.sentence?.join(" ") || "Type your sentence here...";
  const isRight = action.position === "right";

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm max-w-sm mx-auto space-y-4">
      {!isRight && (
        <div className="flex items-start gap-2">
          <div className="shrink-0 flex flex-col items-center ">
            <div className="h-8 w-8 rounded-full bg-purple-100 overflow-hidden border border-purple-200">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
                alt="Lily"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[8px] mt-1 font-bold text-muted-foreground uppercase tracking-tight">
              You
            </span>
          </div>
          <div className="p-3 border-2 border-orange-400/50 rounded-xl rounded-tl-none bg-muted/30 flex-1">
            <p className="text-xs text-card-foreground">{sentence}</p>
          </div>
        </div>
      )}

      {isRight && (
        <div className="flex items-end gap-2 justify-end">
          <div className="p-3 border-2 border-orange-400/50 rounded-xl rounded-tr-none bg-muted/30 flex-1">
            <p className="text-xs text-card-foreground">{sentence}</p>
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 overflow-hidden border border-blue-200">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[8px] mt-1 font-bold text-muted-foreground uppercase tracking-tight">
              You
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
