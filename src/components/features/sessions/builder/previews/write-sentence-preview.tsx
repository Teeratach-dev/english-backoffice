import { WriteSentenceAction } from "@/types/action.types";

interface WriteSentencePreviewProps {
  action: WriteSentenceAction;
}

export function WriteSentencePreview({ action }: WriteSentencePreviewProps) {
  const sentence = action.sentence?.join(" ") || "Type your sentence here...";

  return (
    <div className="p-8 border rounded-lg bg-background shadow-lg max-w-sm mx-auto relative overflow-hidden group">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
      <p className="text-sm font-medium text-foreground leading-relaxed italic">
        {sentence}
      </p>
    </div>
  );
}
