"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useEngagementSync } from "@/hooks/use-engagement-sync";
import { formatStarCount } from "@/lib/format-stars";
import {
  getBlogViewCount,
  isBlogLoved,
  recordBlogViewIfNewSession,
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

type BlogPostHeaderEngagementProps = {
  slug: string;
  labels: { love: string; loved: string; views: string };
};

export function BlogPostHeaderEngagement({ slug, labels }: BlogPostHeaderEngagementProps) {
  const sync = useEngagementSync();
  const [loved, setLoved] = useState(false);
  const [views, setViews] = useState(0);
  const slugRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const first = slugRef.current === null;
    const slugChanged = slugRef.current !== slug;
    slugRef.current = slug;
    setLoved(isBlogLoved(slug));
    if (first || slugChanged) {
      const v = recordBlogViewIfNewSession(slug);
      setViews(v);
    } else {
      setViews(getBlogViewCount(slug));
    }
  }, [slug, sync]);

  const onLove = useCallback(() => {
    const next = toggleBlogLove(slug);
    setLoved(next);
  }, [slug]);

  const loveCount = loved ? 1 : 0;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
      <button
        type="button"
        onClick={onLove}
        className={cn(
          "btn-interactive inline-flex min-h-[44px] items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-md backdrop-blur-md sm:min-h-0 sm:px-4 sm:py-2.5 sm:text-base",
          loved
            ? "border-rose-300/90 bg-rose-50/95 text-rose-900 ring-1 ring-rose-200/80"
            : "border-white/80 bg-white/80 text-slate-800 ring-1 ring-violet-200/50 hover:border-rose-200/90 hover:bg-rose-50/70",
        )}
        aria-pressed={loved}
        aria-label={loved ? labels.loved : labels.love}
      >
        <span className="text-lg leading-none sm:text-xl" aria-hidden>
          {loved ? "♥" : "♡"}
        </span>
        <span className="tabular-nums">{formatStarCount(loveCount)}</span>
        <span>{loved ? labels.loved : labels.love}</span>
      </button>
      <span
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-2 text-sm font-semibold text-slate-800 shadow-md ring-1 ring-violet-200/40 backdrop-blur-md sm:min-h-0 sm:px-4 sm:py-2.5 sm:text-base"
        aria-label={`${views} ${labels.views}`}
      >
        <EyeIcon className="h-4 w-4 shrink-0 text-violet-600 sm:h-5 sm:w-5" />
        <span className="tabular-nums">{formatStarCount(views)}</span>
        <span className="text-slate-600">{labels.views}</span>
      </span>
    </div>
  );
}
