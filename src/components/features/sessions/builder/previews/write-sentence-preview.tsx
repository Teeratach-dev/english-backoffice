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
    <div className="w-full p-4 border-2 border-orange-400/50 rounded-xl bg-muted/30 max-w-sm mx-auto">
      <p className="text-sm text-card-foreground">{sentence}</p>
    </div>
  );
}
