import { Action } from "@/types/action.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionPreview } from "./session-preview";

interface PhonePreviewProps {
  actions: Action[];
}

export function PhonePreview({ actions }: PhonePreviewProps) {
  return (
    <div className="flex justify-center  bg-muted/10 rounded-xl">
      <div className="relative w-90 h-180 bg-background border-4 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        {/* iPhone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[30px] w-[150px] bg-gray-800 rounded-b-2xl z-20"></div>

        {/* Status Bar Mockup */}
        <div className="h-12 w-full bg-background flex items-center justify-between px-6 pt-2 select-none z-10">
          <span className="text-xs font-semibold">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-foreground rounded-sm"></div>
            <div className="w-0.5 h-2.5 bg-foreground rounded-sm"></div>
          </div>
        </div>

        {/* Screen Content */}
        <ScrollArea className="flex-1 w-full relative">
          <div className="px-4 py-4 space-y-6 ">
            {actions.map((action, idx) => (
              <div
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                key={(action as any).id || idx}
                className=""
              >
                <SessionPreview
                  action={action}
                  isShowShadow={false}
                  isHoverEffect={false}
                  useBorder={false}
                />
              </div>
            ))}
            {actions.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 text-center px-10 pt-20 opacity-50">
                <p className="text-xs">No actions to preview</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/20 rounded-full z-20"></div>
      </div>
    </div>
  );
}
