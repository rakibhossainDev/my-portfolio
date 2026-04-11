"use client";

import { CertificateCard } from "@/components/cards/CertificateCard";
import { HorizontalScrollHint } from "@/components/ui/horizontal-scroll-hint";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CertificateSection() {
  const { locale } = usePreferences();
  const { certificates, sectionTaglines, hydrated } = useSiteData();
  const bn = locale === "bn";

  const heading = bn ? "সার্টিফিকেশন" : "Certifications";
  const sub = bn
    ? "আমার পেশাদার দক্ষতা প্রমাণ করে এমন স্বীকৃতি এবং শংসাপত্র।"
    : "Professional certifications and credentials showcasing my expertise.";

  if (hydrated && (!certificates || certificates.length === 0)) {
    return null;
  }

  return (
    <section
      id="certificates"
      className="scroll-mt-24 border-t border-white/40 bg-white/15 py-6 backdrop-blur-sm sm:py-8 md:py-9"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <div className={cn("transition-all duration-700", hydrated ? "fade-in-content" : "opacity-0")}>
          <header className="max-w-2xl">
            {!hydrated ? (
              <Skeleton className="h-10 w-48" />
            ) : (
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                {heading}
              </h2>
            )}
            <div className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg" suppressHydrationWarning>
              {!hydrated ? <Skeleton className="h-7 w-full max-w-md" /> : sub}
            </div>
          </header>

          <HorizontalScrollHint
            className="mt-5 sm:mt-6"
            hintLabel="Scroll sideways for more certificates"
            showScrollButtons
            scrollClassName="-mx-1 px-1 pb-1 sm:-mx-0 sm:px-0"
          >
            <ul className="flex w-max gap-4 pb-2 sm:gap-6">
              {!hydrated ? (
                <>
                  {[1, 2].map((i) => (
                    <li key={i} className="w-[min(100vw-2.5rem,350px)] h-[420px] sm:h-[450px] shrink-0 sm:w-[350px]">
                      <div className="h-full rounded-2xl border border-white/50 bg-white/20 p-0 overflow-hidden">
                        <Skeleton className="h-full w-full" />
                      </div>
                    </li>
                  ))}
                </>
              ) : (
                certificates.map((cert) => (
                  <li key={cert.id} className="w-[min(100vw-2.5rem,350px)] h-[420px] sm:h-[450px] shrink-0 sm:w-[350px]">
                    <article className="h-full">
                      <CertificateCard certificate={cert} className="h-full" />
                    </article>
                  </li>
                ))
              )}
            </ul>
          </HorizontalScrollHint>
        </div>
      </div>
    </section>
  );
}
