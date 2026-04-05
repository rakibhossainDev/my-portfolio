"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SCROLL_STEP = 300;

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

type HorizontalScrollHintProps = {
  children: React.ReactNode;
  className?: string;
  /** Screen-reader hint */
  hintLabel?: string;
  /** Clickable arrows that scroll ~300px (Projects / Blog sections). */
  showScrollButtons?: boolean;
  /** Classes on the scrollable element (overflow-x-auto). */
  scrollClassName?: string;
};

/**
 * Horizontal row with optional glass arrow controls + edge fades.
 */
export function HorizontalScrollHint({
  children,
  className,
  hintLabel = "Scroll sideways",
  showScrollButtons = false,
  scrollClassName,
}: HorizontalScrollHintProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setCanLeft(scrollLeft > 8);
    setCanRight(scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, children]);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  }, []);

  return (
    <div className={cn("relative", className)}>
      <span className="sr-only">{hintLabel}</span>

      {showScrollButtons ? (
        <button
          type="button"
          aria-label="Scroll left"
          disabled={!canLeft}
          onClick={() => scrollByDir(-1)}
          className="absolute left-0 top-1/2 z-[5] -translate-y-1/2 rounded-2xl border border-white/75 bg-white/50 p-2 shadow-lg shadow-violet-500/15 ring-2 ring-violet-200/45 backdrop-blur-md transition hover:bg-white/70 disabled:pointer-events-none disabled:opacity-25 sm:left-1 sm:p-2.5 md:p-3"
        >
          <motion.span
            className="flex items-center justify-center"
            animate={{ x: [0, -6, 0], y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronLeft className="h-7 w-7 text-violet-600 sm:h-8 sm:w-8 md:h-10 md:w-10" />
          </motion.span>
        </button>
      ) : null}

      <div
        ref={scrollerRef}
        className={cn(
          "scrollbar-hide overflow-x-auto scroll-smooth",
          scrollClassName,
        )}
      >
        {children}
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-14 bg-gradient-to-l from-white/98 via-white/55 to-transparent sm:w-20 md:w-28"
        aria-hidden
      />

      {showScrollButtons ? (
        <button
          type="button"
          aria-label="Scroll right"
          disabled={!canRight}
          onClick={() => scrollByDir(1)}
          className={cn(
            "absolute right-1 top-1/2 z-[5] -translate-y-1/2 rounded-2xl border border-white/75 bg-white/50 p-2 shadow-lg shadow-violet-500/20 ring-2 ring-violet-200/50 backdrop-blur-md transition hover:bg-white/70 disabled:pointer-events-none disabled:opacity-25 sm:right-2 sm:p-2.5 md:p-3",
          )}
        >
          <motion.span
            className="flex items-center justify-center"
            animate={{ x: [0, 8, 0], y: [0, -5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight className="h-7 w-7 text-violet-600 sm:h-8 sm:w-8 md:h-10 md:w-10" />
          </motion.span>
        </button>
      ) : (
        <div
          className="pointer-events-none absolute inset-y-0 right-1 z-[2] flex w-14 items-center justify-end sm:right-2 sm:w-20 md:w-28"
          aria-hidden
        >
          <motion.span
            className="flex items-center justify-center rounded-2xl border border-white/75 bg-white/50 px-2 py-3 shadow-lg shadow-violet-500/20 ring-2 ring-violet-200/50 backdrop-blur-md sm:px-3 sm:py-4 md:px-4 md:py-5"
            animate={{ x: [0, 8, 0], y: [0, -5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight className="h-7 w-7 text-violet-600 sm:h-8 sm:w-8 md:h-10 md:w-10" />
          </motion.span>
        </div>
      )}
    </div>
  );
}
