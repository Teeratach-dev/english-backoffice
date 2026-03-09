"use client";

import { ChatAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail, Eye, EyeOff } from "lucide-react";
import React from "react";

interface ChatPreviewProps {
  action: ChatAction;
  isShowShadow?: boolean;
  useBorder?: boolean;
}

export function ChatPreview({
  action,
  isShowShadow = true,
  useBorder = true,
}: ChatPreviewProps) {
  const [isRevealed, setIsRevealed] = React.useState(false);

  const isAudioOnly = !action.isDisplay && !action.isReadable;
  const isBlurryMode = !action.isDisplay && action.isReadable;
  const isNormalMode = action.isDisplay;
  const shouldBlur = isBlurryMode && !isRevealed;
  const isRight = action.position === "right";

  return (
    <div className="space-y-2 max-w-sm mx-auto">
      <div
        className={cn(
          "flex items-start gap-2",
          isRight ? "flex-row-reverse" : "flex-row",
        )}
      >
        <ChatAvatar sender={action.sender} />

        <div className="flex-1">
          <div
            className={cn(
              "bg-background border rounded-2xl p-3 text-sm text-card-foreground relative",
              isRight ? "rounded-tr-none" : "rounded-tl-none",
              shouldBlur &&
                "blur-sm opacity-50 select-none grayscale cursor-help",
            )}
          >
            {isAudioOnly ? (
              <div className="flex justify-center gap-6 py-1">
                <AudioCircleButton />
                <AudioCircleButton isSnail />
              </div>
            ) : (
              <ChatTextContent action={action} />
            )}

            {isBlurryMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRevealed(!isRevealed);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground transition-colors z-20"
                title={isRevealed ? "Hide content" : "Reveal content"}
              >
                {isRevealed ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>

          {(isNormalMode || isBlurryMode) && (
            <div
              className={cn(
                "mt-1.5 flex gap-2",
                isRight ? "justify-end" : "justify-start",
              )}
            >
              <AudioCircleButton />
              <AudioCircleButton isSnail />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatAvatar({ sender }: { sender?: ChatAction["sender"] }) {
  return (
    <div className="shrink-0 flex flex-col items-center">
      <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center border border-purple-200">
        {sender?.imageUrl ? (
          <img
            src={sender.imageUrl}
            alt={sender.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-purple-600 font-bold text-lg">
            {sender?.name?.[0]?.toUpperCase() || "U"}
          </span>
        )}
      </div>
      <span className="text-xxs mt-1 text-foreground max-w-15 truncate text-center">
        {sender?.name || "User"}
      </span>
    </div>
  );
}

function AudioCircleButton({ isSnail = false }: { isSnail?: boolean }) {
  const Icon = isSnail ? Snail : Volume2;
  return (
    <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function ChatTextContent({ action }: { action: ChatAction }) {
  if (!action.text || action.text.length === 0) {
    return <span className="opacity-50 italic">No message...</span>;
  }

  return (
    <div className="leading-relaxed">
      {action.text.map((word, i) => (
        <span
          key={i}
          className={cn(
            "inline-block mx-0.5",
            word.bold && "font-bold",
            word.italic &&
              (action.position === "right" ? "" : "italic text-orange-600"),
            word.underline &&
              "underline underline-offset-4 decoration-current/40",
            word.highlight &&
              (action.position === "right"
                ? "bg-white/20 px-1 rounded-sm"
                : "bg-primary/20 text-primary px-1 rounded-sm"),
          )}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}
