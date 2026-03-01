"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionType, ACTION_TYPE_LABELS } from "@/types/action.types";
import {
  Volume2,
  Image as ImageIcon,
  MessageCircle,
  Info,
  Type,
  ListChecks,
  ArrowLeftRight,
  CreditCard,
  Keyboard,
  MousePointer2,
  PenTool,
  Columns2,
  Snail,
} from "lucide-react";

interface ActionTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: ActionType) => void;
}

const PREVIEWS: Record<ActionType, React.ReactNode> = {
  [ActionType.Explain]: (
    <div className="space-y-3 w-full">
      <div className="border rounded-md p-3 relative bg-background">
        <div className="text-center font-bold text-lg text-foreground">
          Used to
        </div>
      </div>
      <div className="border rounded-md p-3 relative bg-background">
        <p className="text-center text-sm text-card-foreground leading-loose">
          to talk about{" "}
          <span className="relative inline-block underline decoration-2 decoration-orange-400/50 underline-offset-5 font-semibold cursor-pointer text-orange-600 dark:text-orange-400">
            repeated
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 bg-orange-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap z-10 animate-in fade-in zoom-in duration-200">
              ซ้ำ ๆ
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-400 rotate-45 rounded-sm"></div>
            </span>
          </span>{" "}
          past actions that you no longer do
        </p>
      </div>
      <div className="border rounded-md p-3 bg-background text-center text-sm text-card-foreground">
        ใช้สำหรับสิ่งที่เคยกระทำในอนาคต แต่ปัจจุบันไม่ได้ทำแล้ว
      </div>
      <div className="border rounded-md p-3 bg-background text-sm space-y-2 text-card-foreground">
        <div className="flex items-start gap-2">
          <span>•</span>
          <p>
            My aunt <span className="text-orange-500 font-medium">used to</span>{" "}
            bake the most delicious chocolate cake.
          </p>
        </div>
      </div>
      <div className="border rounded-md p-3 bg-background text-sm space-y-2 text-card-foreground">
        <div className="flex items-start gap-2">
          <span>•</span>
          <p>
            I{" "}
            <span className="text-orange-500 italic font-medium">used to</span>{" "}
            take the train to the school.
          </p>
        </div>
      </div>
      <div className="border rounded-md p-3 bg-background text-sm space-y-2 text-card-foreground">
        <div className="text-right text-sm text-gray-500 mt-1">
          แต่ถ้ายังทำอยู่มาจนถึงปัจจุบัน จะไม่ใช้ used to
        </div>
      </div>
    </div>
  ),
  [ActionType.Reading]: (
    <div className="space-y-2">
      <div className="p-4 border rounded-lg bg-background shadow-sm flex">
        <p className="text-sm leading-relaxed text-card-foreground">
          The English language is widespread and dynamic. It has become a global
          language for business, science, and technology...
        </p>
      </div>
      <div className="flex justify-end gap-2 shrink-0">
        <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
          <Snail className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  ),
  [ActionType.Audio]: (
    <div className="w-full">
      <div className="py-6 px-10 flex justify-center gap-10">
        <div className="h-11 w-11 rounded-full border flex items-center justify-center bg-background">
          <Volume2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="h-11 w-11 rounded-full border flex items-center justify-center bg-background">
          <Snail className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  ),
  [ActionType.Chat]: (
    <div className="space-y-8">
      <div className="flex items-start gap-2">
        <div className="shrink-0 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center border border-purple-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
              alt="Lily"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xxs mt-1 text-foreground">Lily</span>
        </div>
        <div className="flex-1">
          <div className="bg-background border rounded-2xl rounded-tl-none p-3 text-sm text-card-foreground">
            Thanks for contaction Nike! My name is Gian, how can I help you?
          </div>
          <div className="mt-1.5 flex gap-2">
            <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
              <Snail className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-2 justify-end">
        <div className="flex-1">
          <div className="flex justify-end">
            <div className="bg-background border rounded-2xl rounded-tr-none p-3 text-sm text-foreground">
              Hello! I want to check if you recieved one product I returned to
              you.
            </div>
          </div>
          <div className="mt-1.5 flex justify-end gap-2">
            <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
              <Snail className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center border border-purple-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
              alt="Lily"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xxs mt-1 text-foreground">Lily</span>
        </div>
      </div>
    </div>
  ),
  [ActionType.Image]: (
    <div className="w-full h-full aspect-video relative overflow-hidden flex items-center justify-center">
      <div className="flex items-end justify-center">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
          alt="Character"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ),
  [ActionType.Column]: (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground ml-1">
          Action image + Action reading
        </p>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 relative overflow-hidden shrink-0 flex justify-center mb-10">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
              alt="Character"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <div className="p-4 border rounded-lg bg-background shadow-sm flex">
              <p className="text-sm leading-relaxed text-card-foreground">
                The English language is widespread and dynamic. It has become a
                global language for business.
              </p>
            </div>
            <div className="flex justify-end gap-2 shrink-0">
              <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
                <Snail className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground ml-1">
          Action image + Action audio
        </p>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 relative overflow-hidden shrink-0 flex justify-center">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
              alt="Character"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full rounded-lg">
            <div className="py-6 px-10 flex justify-center gap-10">
              <div className="h-11 w-11 rounded-full border flex items-center justify-center bg-background">
                <Volume2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="h-11 w-11 rounded-full border flex items-center justify-center bg-background">
                <Snail className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  [ActionType.Choice]: (
    <div className="flex flex-col items-center gap-y-3">
      <div className="px-6 py-2 bg-background border rounded-full text-sm text-card-foreground shadow-sm">
        He is very lazy.
      </div>
      <div className="px-6 py-2 bg-background border rounded-full text-sm text-card-foreground shadow-sm">
        She wants to borrow Junior's game.
      </div>
      <div className="px-6 py-2 bg-background border rounded-full text-sm text-card-foreground shadow-sm">
        It's because the thunderstorm.
      </div>
    </div>
  ),
  [ActionType.Reorder]: (
    <div className="space-y-2">
      <div className="space-y-6">
        <div className="flex gap-2 border-b border-muted-foreground/30 min-h-6">
          <div className="px-3 py-1 mb-1 bg-background rounded-full text-sm text-card-foreground border">
            Other
          </div>
          <div className="px-3 py-1 mb-1 bg-background rounded-full text-sm text-card-foreground border">
            businessman
          </div>
        </div>
        <div className="border-b border-muted-foreground/30 h-1"></div>
      </div>
      <div className="flex justify-center flex-wrap gap-2">
        <div className="w-12 h-6"></div>
        <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground">
          me
        </div>
        <div className="w-12 h-6"></div>
        <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground">
          respect
        </div>
        <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground">
          much
        </div>
        <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground">
          much
        </div>
      </div>
    </div>
  ),
  [ActionType.MatchCard]: (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {[
          ["International", "วันหยุดพักผ่อน"],
          ["Vacations", "พายุฝนฟ้าคะนอง"],
          ["Thunderstorm", "นานาชาติ"],
        ].map(([en, th], i) => (
          <React.Fragment key={i}>
            <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground text-center">
              {en}
            </div>
            <div className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground text-center">
              {th}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="border-b" />
      {/* Text + Audio */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {["International", "Vacations", "Thunderstorm"].map((word, i) => (
          <React.Fragment key={i}>
            <div className="px-2 py-1 bg-background border rounded-full text-sm text-card-foreground text-center">
              {word}
            </div>
            <div className="px-2 py-1 bg-background border rounded-full text-muted-foreground flex justify-center">
              <div className="p-1 flex justify-center">
                <Volume2 className="h-3 w-3" />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
  [ActionType.FillSentenceByTyping]: (
    <div className="flex justify-center">
      <p className="text-sm text-card-foreground">
        He{" "}
        <span className="inline-block w-16 border-b border-foreground mx-1 translate-y-0.5"></span>{" "}
        give me a bad grade.
      </p>
    </div>
  ),
  [ActionType.FillSentenceWithChoice]: (
    <div className="space-y-6">
      <p className="text-sm text-center text-card-foreground">
        He{" "}
        <span className="inline-block w-16 border-b border-foreground mx-1 translate-y-0.5"></span>{" "}
        give me a bad grade.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {["businessman", "always", "Other", "respect", "much", "much"].map(
          (word, i) => (
            <div
              key={i}
              className="px-3 py-1 bg-background border rounded-full text-sm text-card-foreground"
            >
              {word}
            </div>
          ),
        )}
      </div>
    </div>
  ),
  [ActionType.WriteSentence]: (
    <div className="w-full p-4 border-2 border-orange-400/50 rounded-xl bg-muted/30">
      <p className="text-sm text-card-foreground">
        He always give me a bad grade.
      </p>
    </div>
  ),
  [ActionType.WriteSentenceInChat]: (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="shrink-0 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center border border-purple-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
              alt="Lily"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xxs mt-1 text-foreground">Lily</span>
        </div>
        <div className="flex-1">
          <div className="bg-background border rounded-2xl rounded-tl-none p-3 text-sm text-card-foreground">
            Thanks for contaction Nike! My name is Gian, how can I help you?
          </div>
          <div className="mt-1.5 flex gap-2">
            <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="h-9 w-9 rounded-full border flex items-center justify-center bg-background">
              <Snail className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end gap-2 justify-end">
        <div className="p-3 border-2 border-orange-400/50 rounded-xl bg-muted/30 flex-1 self-start">
          <p className="text-xs text-card-foreground">
            He always give me a bad grade.
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center border border-purple-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily"
              alt="Lily"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xxs mt-1 text-foreground">You</span>
        </div>
      </div>
    </div>
  ),
};

const ACTION_ICONS: Record<ActionType, React.ReactNode> = {
  [ActionType.Explain]: <Info className="h-4 w-4" />,
  [ActionType.Reading]: <Type className="h-4 w-4" />,
  [ActionType.Audio]: <Volume2 className="h-4 w-4" />,
  [ActionType.Chat]: <MessageCircle className="h-4 w-4" />,
  [ActionType.Image]: <ImageIcon className="h-4 w-4" />,
  [ActionType.Column]: <Columns2 className="h-4 w-4" />,
  [ActionType.Choice]: <ListChecks className="h-4 w-4" />,
  [ActionType.Reorder]: <ArrowLeftRight className="h-4 w-4" />,
  [ActionType.MatchCard]: <CreditCard className="h-4 w-4" />,
  [ActionType.FillSentenceByTyping]: <Keyboard className="h-4 w-4" />,
  [ActionType.FillSentenceWithChoice]: <MousePointer2 className="h-4 w-4" />,
  [ActionType.WriteSentence]: <PenTool className="h-4 w-4" />,
  [ActionType.WriteSentenceInChat]: <MessageCircle className="h-4 w-4" />,
};

export function ActionTypeSelector({
  open,
  onOpenChange,
  onSelect,
}: ActionTypeSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl flex flex-col p-0 overflow-hidden fixed left-1/2 -translate-x-1/2 top-8 bottom-24 translate-y-0! z-100 max-h-none">
        <DialogHeader className="p-4 sm:p-6 border-b shrink-0">
          <DialogTitle>Select Action Type</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pb-6">
              {(Object.values(ActionType) as ActionType[]).map((type) => (
                <div
                  key={type}
                  className="group relative flex flex-col gap-3 p-3 sm:p-4 border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-sm hover:shadow-md bg-card"
                  onClick={() => {
                    onSelect(type);
                    onOpenChange(false);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {ACTION_ICONS[type]}
                    </div>
                    <h3 className="font-bold text-sm tracking-tight text-foreground">
                      {ACTION_TYPE_LABELS[type]}
                    </h3>
                  </div>

                  <div className="flex flex-1 overflow-hidden items-center justify-center min-h-32">
                    {PREVIEWS[type]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
