"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

const TooltipContext = React.createContext<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

const Tooltip = ({ children, delayDuration = 0 }: { children: React.ReactNode; delayDuration?: number }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <TooltipContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                {children}
            </div>
        </TooltipContext.Provider>
    );
};

const TooltipTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
    ({ className, children, asChild, ...props }, ref) => {
        const Comp = asChild ? React.Fragment : "button";
        // If asChild is true, we just render the child. Logic is handled by parent div in Tooltip. 
        // Simplified for this Scroll component which wraps the trigger.

        if (asChild) {
            return <>{children}</>;
        }

        return (
            <button
                ref={ref}
                className={cn("", className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "bottom" | "left" | "right" }>(
    ({ className, side = "top", ...props }, ref) => {
        const context = React.useContext(TooltipContext);

        if (!context?.open) return null;

        return (
            <div
                ref={ref}
                data-side={side}
                className={cn(
                    "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 absolute w-max max-w-xs",
                    side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
                    side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
                    side === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
                    side === "right" && "left-full top-1/2 -translate-y-1/2 ml-2",
                    className
                )}
                {...props}
            />
        );
    }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
