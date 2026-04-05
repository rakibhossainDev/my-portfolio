"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { useEngagementSync } from "@/hooks/use-engagement-sync";
import { formatStarCount } from "@/lib/format-stars";
import {
  getBlogLoveCountForDevice,
  getBlogViewCount,
  isBlogLoved,
  toggleBlogLove,
} from "@/lib/engagement-storage";
import { cn } from "@/lib/utils";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export function BlogEngagementBar({ slug }: { slug: string }) {
  const sync = useEngagementSync();
  const [loved, setLoved] = useState(false);
  const [views, setViews] = useState(0);
  const [loves, setLoves] = useState(0);

  useLayoutEffect(() => {
    setLoved(isBlogLoved(slug));
    setViews(getBlogViewCount(slug));
    setLoves(getBlogLoveCountForDevice(slug));
  }, [slug, sync]);

  const onLove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const next = toggleBlogLove(slug);
      setLoved(next);
      setLoves(next ? 1 : 0);
    },
    [slug],
  );

  return (
    <div
      className="flex flex-none flex-wrap items-center justify-between gap-2 border-t border-white/50 bg-white/25 px-3 py-2.5 backdrop-blur-sm sm:px-5 sm:py-3"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onLove}
        className={cn(
          "btn-interactive inline-flex min-h-[40px] min-w-[40px] items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md sm:min-h-0 sm:min-w-0 sm:px-3 sm:text-sm",
          loved
            ? "border-rose-300/90 bg-rose-50/95 text-rose-800 ring-1 ring-rose-200/70"
            : "border-white/70 bg-white/70 text-slate-700 ring-1 ring-white/50 hover:border-rose-200/80 hover:bg-rose-50/60",
        )}
        aria-pressed={loved}
        aria-label={loved ? "Remove reaction" : "Love this post"}
      >
        <span className="text-base leading-none sm:text-lg" aria-hidden>
          {loved ? "♥" : "♡"}
        </span>
        <span className="tabular-nums">{formatStarCount(loves)}</span>
        <span className="hidden sm:inline">{loved ? "Loved" : "Love"}</span>
      </button>
      <span className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md sm:min-h-0 sm:px-3 sm:text-sm">
        <EyeIcon className="h-3.5 w-3.5 shrink-0 text-violet-600 sm:h-4 sm:w-4" />
        <span className="tabular-nums">{formatStarCount(views)}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs sm:normal-case">
          views
        </span>
      </span>
    </div>
  );
}
