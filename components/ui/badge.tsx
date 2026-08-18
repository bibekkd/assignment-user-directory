import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
        variant === "default" && "border-transparent bg-zinc-900 text-zinc-50 shadow-xs hover:bg-zinc-850 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
        variant === "secondary" && "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
        variant === "destructive" && "border-transparent bg-red-500 text-red-50 shadow-xs hover:bg-red-650 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-800",
        variant === "outline" && "border-zinc-200 text-zinc-950 dark:border-zinc-800 dark:text-zinc-50",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
