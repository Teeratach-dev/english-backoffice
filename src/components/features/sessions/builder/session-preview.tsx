"use client";

import React from "react";
import { Action, ActionType } from "@/types/action.types";
import {
  Volume2,
  Snail,
  ImageIcon,
  Type,
  MessageCircle,
  ListChecks,
  ArrowLeftRight,
  CreditCard,
  Keyboard,
  MousePointer2,
  PenTool,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionPreviewProps {
  action: Action | null;
}

export function SessionPreview({ action }: SessionPreviewProps) {
  if (!action) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 text-center px-10">
        <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted">
          <ImageIcon className="h-8 w-8 opacity-20" />
        </div>
        <div>
          <p className="font-bold text-sm text-foreground">
            No Action Selected
          </p>
          <p className="text-xs">
            Select an action to see its live preview here
          </p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    switch (action.type) {
      case ActionType.Explain:
        return (
          <div className="space-y-4 p-4 border-2 border-orange-100 rounded-2xl bg-orange-50/30 shadow-sm max-w-sm mx-auto">
            <div className="text-center font-black text-2xl mb-4 text-orange-600 tracking-tight">
              Used to
            </div>
            <div className="bg-white dark:bg-card border-2 border-orange-200 rounded-xl p-5 relative shadow-sm">
              <p className="text-center text-base text-foreground leading-relaxed font-medium">
                {action.text
                  ? action.text.map((word: any, i: number) => (
                      <span
                        key={i}
                        className={cn(
                          "inline-block mx-0.5",
                          word.translation?.length > 0 &&
                            "relative underline decoration-orange-400 decoration-2 underline-offset-4 cursor-help text-orange-600",
                        )}
                      >
                        {word.text}
                        {word.translation?.length > 0 && (
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap z-10 animate-in fade-in zoom-in duration-200">
                            {word.translation[0]}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rotate-45 rounded-sm"></div>
                          </span>
                        )}
                      </span>
                    ))
                  : "to talk about repeated past actions that you no longer do"}
              </p>
            </div>
            {action.explanation && (
              <div className="bg-white/80 border border-orange-100 rounded-xl p-4 text-center text-sm text-muted-foreground italic font-medium">
                {action.explanation}
              </div>
            )}
          </div>
        );

      case ActionType.Chat:
        return (
          <div className="space-y-6 p-4 border rounded-2xl bg-background shadow-sm max-w-sm mx-auto min-h-75 flex flex-col justify-end">
            <div
              className={cn(
                "flex items-start gap-3",
                action.position === "right" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div className="shrink-0 flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                  {action.sender?.name?.[0] || "U"}
                </div>
                <span className="text-[10px] mt-1 font-bold text-muted-foreground">
                  {action.sender?.name || "User"}
                </span>
              </div>
              <div
                className={cn(
                  "flex flex-1 flex-col",
                  action.position === "right" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl p-4 text-sm shadow-sm max-w-[85%]",
                    action.position === "right"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none border border-muted-foreground/10",
                  )}
                >
                  {action.text?.map((w: any) => w.text).join(" ") ||
                    "Message content goes here..."}
                </div>
              </div>
            </div>
          </div>
        );

      case ActionType.Image:
        return (
          <div className="p-2 border rounded-2xl bg-background shadow-lg overflow-hidden max-w-sm mx-auto">
            <div className="aspect-video bg-muted rounded-xl relative overflow-hidden flex items-center justify-center border border-muted-foreground/10">
              {action.url ? (
                <img
                  src={action.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-16 w-16 text-muted-foreground/20" />
              )}
            </div>
            <div className="p-3 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Image Content
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground text-center space-y-3 bg-muted/5">
            <div className="p-3 bg-muted rounded-full">
              <Info className="h-6 w-6 opacity-40" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                {action.type} Preview
              </p>
              <p className="text-[10px] italic">
                Live preview for this type is coming soon
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-500 w-full">
      <div className="relative group">
        <div className="absolute -inset-4 bg-linear-to-r from-primary/5 to-purple-500/5 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative">{renderPreview()}</div>
      </div>
    </div>
  );
}
