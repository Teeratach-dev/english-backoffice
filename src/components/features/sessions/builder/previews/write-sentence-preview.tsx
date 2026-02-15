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
      <p className="text-sm font-medium text-foreground leading-relaxed italic">
        {sentence}
      </p>
    </div>
  );
}
