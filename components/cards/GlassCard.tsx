import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Shared frosted surface for stats, experience tiles, and content panels.
 */
export function GlassCard({ children, className, hover = true, ...props }: GlassCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-white/70 bg-white/45 shadow-lg shadow-violet-500/[0.07] backdrop-blur-xl",
        hover && "card-interactive",
        className,
      )}
    >
      {children}
    </div>
  );
}
