import { WriteSentenceInChatAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface WriteSentenceInChatPreviewProps {
  action: WriteSentenceInChatAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function WriteSentenceInChatPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: WriteSentenceInChatPreviewProps) {
  const sentence = action.sentence?.join(" ") || "Type your sentence here...";
  const isRight = action.position === "right";

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div
        className={cn(
          "flex items-end gap-2",
          isRight ? "justify-end" : "justify-start",
        )}
      >
        {isRight && (
          <>
            <div className="p-3 border-2 border-orange-400/50 rounded-xl bg-muted/30 flex-1 self-start">
              <p className="text-xs text-card-foreground">{sentence}</p>
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center border border-purple-200">
                <span className="text-purple-600 font-bold text-lg">Y</span>
              </div>
              <span className="text-xxs mt-1 text-foreground">You</span>
            </div>
          </>
        )}
        {!isRight && (
          <>
            <div className="shrink-0 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center border border-purple-200">
                <span className="text-purple-600 font-bold text-lg">Y</span>
              </div>
              <span className="text-xxs mt-1 text-foreground">You</span>
            </div>
            <div className="p-3 border-2 border-orange-400/50 rounded-xl bg-muted/30 flex-1 self-start">
              <p className="text-xs text-card-foreground">{sentence}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
