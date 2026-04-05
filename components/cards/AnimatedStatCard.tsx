"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/cards/GlassCard";
import { cn } from "@/lib/utils";

const DURATION_MS = 4000;

function parseLeadingInt(s: string): number | null {
  const m = s.trim().match(/^(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function AnimatedStatCard({
  value,
  suffix,
  label,
  className,
}: {
  value: string;
  suffix: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const target = parseLeadingInt(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === null) return;
    if (!inView) {
      setDisplay(0);
      return;
    }
    if (target === 0) {
      setDisplay(0);
      return;
    }

    let start: number | null = null;
    let frame = 0;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = easeOutCubic(t);
      setDisplay(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  const showNumber = target === null ? value : String(display);

  return (
    <div ref={ref}>
      <GlassCard className={cn("p-4 text-center sm:p-5 md:p-6", className)}>
      <p className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent tabular-nums">
          {showNumber}
        </span>
        <span className="text-slate-800">{suffix}</span>
      </p>
      <p className="mt-2 text-balance text-xs font-medium leading-snug text-slate-600 sm:text-sm">{label}</p>
      </GlassCard>
    </div>
  );
}
