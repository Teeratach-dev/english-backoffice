"use client";

import { ChatAction } from "@/types/action.types";
import { cn } from "@/lib/utils";
import { Volume2, Snail, Eye, EyeOff } from "lucide-react";
import React from "react";

interface ChatPreviewProps {
  action: ChatAction;
  isShowShadow?: boolean;
}

/**
 * ChatPreview Component
 * Logic:
 * 1. isDisplay=false && isReadable=false: Show only audio control panel (horizontal)
 * 2. isDisplay=false && isReadable=true: Show blurred text (default) + Eye toggle + Audio panel
 * 3. isDisplay=true: Show normal text, ignore isReadable, no Eye toggle
 */
export function ChatPreview({ action, isShowShadow = true }: ChatPreviewProps) {
  const [isRevealed, setIsRevealed] = React.useState(false);

  // Conditions based on prompt
  const isAudioOnly = !action.isDisplay && !action.isReadable;
  const isBlurryMode = !action.isDisplay && action.isReadable;
  const isNormalMode = action.isDisplay;

  // Determine if content should be blurred
  const shouldBlur = isBlurryMode && !isRevealed;

  return (
    <div
      className={cn(
        "space-y-6 p-4 border rounded-lg bg-background max-w-sm mx-auto flex flex-col justify-end relative overflow-hidden group/chat",
        isShowShadow ? "shadow-md" : "shadow-none",
      )}
    >
      <BackgroundDecor />

      <div
        className={cn(
          "flex items-start gap-4",
          action.position === "right" ? "flex-row-reverse" : "flex-row",
        )}
      >
        <ChatAvatar sender={action.sender} />

        <ChatBubble
          action={action}
          shouldBlur={shouldBlur}
          isAudioOnly={isAudioOnly}
        />

        {(isNormalMode || isBlurryMode) && (
          <SideControls
            position={action.position}
            isBlurryMode={isBlurryMode}
            isRevealed={isRevealed}
            onToggleReveal={() => setIsRevealed(!isRevealed)}
          />
        )}
      </div>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
    </>
  );
}

function ChatAvatar({ sender }: { sender?: ChatAction["sender"] }) {
  return (
    <div className="shrink-0 flex flex-col items-center self-end">
      <div className="h-10 w-10 rounded-4xl bg-linear-to-br from-indigo-500 to-primary overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-background ring-2 ring-muted/20">
        {sender?.imageUrl ? (
          <img
            src={sender.imageUrl}
            alt={sender.name}
            className="w-full h-full object-cover"
          />
        ) : (
          sender?.name?.[0]?.toUpperCase() || "U"
        )}
      </div>
      <span className="text-[8px] mt-1.5 font-bold text-muted-foreground uppercase tracking-widest max-w-15 truncate text-center">
        {sender?.name || "User"}
      </span>
    </div>
  );
}

function AudioActionButtons({ className }: { className?: string }) {
  const iconClass = cn(
    "h-5 w-5 hover:text-primary cursor-pointer transition-colors text-primary animate-pulse",
    className,
  );
  return (
    <>
      <Volume2 className={iconClass} />
      <Snail className={iconClass} />
    </>
  );
}

function ChatBubble({
  action,
  shouldBlur,
  isAudioOnly,
}: {
  action: ChatAction;
  shouldBlur: boolean;
  isAudioOnly: boolean;
}) {
  return (
    <div className="flex relative self-end">
      <div
        className={cn(
          "rounded-2xl p-4 text-sm shadow-xs transition-all duration-300 relative min-w-30",
          action.position === "right"
            ? "bg-muted text-foreground rounded-tr-none border border-muted-foreground/10"
            : "bg-muted text-foreground rounded-tl-none border border-muted-foreground/10",
          shouldBlur && "blur-sm opacity-50 select-none grayscale cursor-help",
        )}
      >
        {isAudioOnly && (
          <div className="flex justify-around">
            <AudioActionButtons />
          </div>
        )}

        {!isAudioOnly && <ChatTextContent action={action} />}
      </div>
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

function SideControls({
  position,
  isBlurryMode,
  isRevealed,
  onToggleReveal,
}: {
  position: string;
  isBlurryMode: boolean;
  isRevealed: boolean;
  onToggleReveal: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 shrink-0 self-end pb-1",
        position === "right" ? "items-end" : "items-start",
      )}
    >
      {isBlurryMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleReveal();
          }}
          className={cn(
            "hover:text-primary cursor-pointer transition-colors text-muted-foreground active:scale-95 flex items-center justify-center",
          )}
          title={isRevealed ? "Hide content" : "Reveal content"}
        >
          {isRevealed ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
      <AudioActionButtons />
    </div>
  );
}
