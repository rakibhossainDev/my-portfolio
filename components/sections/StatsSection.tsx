"use client";

import { AnimatedStatCard } from "@/components/cards/AnimatedStatCard";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function StatsSection() {
  const { locale } = usePreferences();
  const { stats, hydrated } = useSiteData();
  const [isMounted, setIsMounted] = useState(false);
  const bn = locale === "bn";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 md:py-9">
      <div className={cn("transition-all duration-700", isMounted && hydrated ? "fade-in-content" : "opacity-0")}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
          {!hydrated ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6" suppressHydrationWarning>
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/50 bg-white/20 p-4 text-center backdrop-blur-md sm:p-5 md:p-6 space-y-3 sm:space-y-4" suppressHydrationWarning>
                  <Skeleton className="mx-auto h-12 w-20 md:h-14" />
                  <Skeleton className="mx-auto mt-2 h-5 w-32" />
                </div>
              ))}
            </div>
          ) : (
            stats.map((s) => (
              <li key={s.id}>
                <AnimatedStatCard
                  value={s.value}
                  suffix={s.suffix}
                  label={bn ? s.labelBn : s.labelEn}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
