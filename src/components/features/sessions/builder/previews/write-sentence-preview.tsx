import { WriteSentenceAction } from "@/types/action.types";
import { cn } from "@/lib/utils";

interface WriteSentencePreviewProps {
  action: WriteSentenceAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function WriteSentencePreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: WriteSentencePreviewProps) {
  const sentence = action.sentence?.join(" ") || "Type your sentence here...";

  return (
    <div
      className={cn(
        "p-8 rounded-lg bg-background max-w-sm mx-auto relative overflow-hidden group",
        isShowShadow ? "shadow-lg" : "shadow-none",
        useBorder ? "border" : "border-none",
      )}
    >
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
      <p className="text-sm font-medium text-foreground leading-relaxed italic">
        {sentence}
      </p>
    </div>
  );
}
