"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { useEngagementSync } from "@/hooks/use-engagement-sync";
import { formatStarCount } from "@/lib/format-stars";
import { isProjectStarred, toggleProjectStar } from "@/lib/engagement-storage";
import { cn } from "@/lib/utils";

function StarGlyph({ className, filled }: { className?: string; filled: boolean }) {
  const d =
    "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z";
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.15}
        strokeLinejoin="round"
        d={d}
      />
    </svg>
  );
}

type ProjectStarButtonProps = {
  projectId: string;
  baseStars: number;
  className?: string;
  /** Larger tap target on cards */
  size?: "sm" | "md";
};

export function ProjectStarButton({ projectId, baseStars, className, size = "md" }: ProjectStarButtonProps) {
  const sync = useEngagementSync();
  const [starred, setStarred] = useState(false);

  useLayoutEffect(() => {
    setStarred(isProjectStarred(projectId));
  }, [projectId, sync]);

  const base = typeof baseStars === "number" && Number.isFinite(baseStars) ? Math.max(0, Math.floor(baseStars)) : 0;
  const total = base + (starred ? 1 : 0);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const next = toggleProjectStar(projectId);
      setStarred(next);
    },
    [projectId],
  );

  const sm = size === "sm";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "btn-interactive inline-flex max-w-full items-center gap-1.5 rounded-full border shadow-md backdrop-blur-md transition-colors",
        starred
          ? "border-amber-300/90 bg-amber-50/95 text-amber-950 ring-1 ring-amber-200/80"
          : "border-white/80 bg-white/90 text-slate-800 ring-1 ring-white/60 hover:border-amber-200/80 hover:bg-amber-50/80",
        sm ? "px-2 py-1 text-[11px] sm:px-2.5 sm:py-1 sm:text-xs" : "px-2.5 py-1.5 text-xs sm:px-3 sm:py-1.5 sm:text-sm",
        className,
      )}
      aria-pressed={starred}
      aria-label={starred ? "Remove your star" : "Star this project"}
    >
      <StarGlyph
        className={cn(
          "shrink-0 text-amber-500",
          sm ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]",
        )}
        filled={starred}
      />
      <span className="min-w-0 truncate font-bold tabular-nums">{formatStarCount(total)}</span>
    </button>
  );
}
