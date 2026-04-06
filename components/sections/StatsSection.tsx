"use client";

import { AnimatedStatCard } from "@/components/cards/AnimatedStatCard";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";

export function StatsSection() {
  const { locale } = usePreferences();
  const { stats } = useSiteData();
  const bn = locale === "bn";

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 md:py-9">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
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
