"use client";

import { AnimatedStatCard } from "@/components/cards/AnimatedStatCard";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";

export function StatsSection() {
  const { locale } = usePreferences();
  const { stats } = useSiteData();
  const bn = locale === "bn";

  return (
    <section className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-4 md:py-6">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5">
        {stats.map((s) => (
          <li key={s.id}>
            <AnimatedStatCard
              value={s.value}
              suffix={s.suffix}
              label={bn ? s.labelBn : s.labelEn}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
