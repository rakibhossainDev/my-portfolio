"use client";

import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { FloatingTechIcons } from "@/components/hero/FloatingTechIcons";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { site } from "@/data/site";
import { homeUiBn } from "@/data/translations";
import { cn } from "@/lib/utils";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function HeroSection() {
  const { locale } = usePreferences();
  const { hero, resolvedHeroImageSrc } = useSiteData();
  const bn = locale === "bn";

  const badge = bn ? hero.badgeBn : hero.badgeEn;
  const role = bn ? hero.roleBn : hero.roleEn;
  const description = bn ? hero.descriptionBn : hero.descriptionEn;
  const viewProjects = bn ? homeUiBn.viewProjects : "View Projects";
  const hireMe = bn ? homeUiBn.hireMe : "Hire Me";

  return (
    <section id="hero" className="relative overflow-hidden border-b border-white/40">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-16 h-64 w-64 rounded-full bg-violet-400/18 blur-3xl" />
        <div className="absolute -right-24 bottom-6 h-72 w-72 rounded-full bg-blue-400/18 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-6 px-3 py-5 sm:gap-8 sm:px-6 sm:py-6 lg:grid-cols-2 lg:items-center lg:gap-6 lg:px-8 lg:py-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/50 px-3 py-1 text-sm font-medium text-violet-800 shadow-sm backdrop-blur-md">
            <span aria-hidden>👋</span>
            {badge}
          </span>

          <h1 className="mt-3 text-[1.65rem] font-bold leading-tight tracking-tight text-slate-900 sm:mt-4 sm:text-3xl sm:leading-tight md:text-4xl lg:text-[3.1rem] lg:leading-[1.1]">
            {site.hero.greeting}{" "}
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {site.hero.name}
            </span>
          </h1>

          <h2 className="mt-2 text-lg font-semibold text-slate-700 sm:text-xl">{role}</h2>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {description}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Link
              href="/#projects"
              className={cn(
                "btn-interactive inline-flex items-center justify-center rounded-xl border-2 border-violet-500/40",
                "bg-white/60 px-6 py-3 text-sm font-semibold text-violet-700 shadow-md backdrop-blur-md",
                "hover:border-violet-500 hover:bg-white/80",
              )}
            >
              {viewProjects}
            </Link>
            <a
              href={site.hero.hireMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
            >
              <WhatsAppGlyph className="h-5 w-5 shrink-0 text-white" />
              {hireMe}
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[340px] justify-center sm:max-w-[380px] lg:mx-0 lg:max-w-none lg:justify-end">
          <div
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
            aria-hidden
          >
            <div
              className="absolute h-[min(100%,360px)] w-[min(100%,360px)] bg-gradient-to-br from-violet-500/45 via-blue-500/35 to-indigo-500/40 opacity-90 blur-2xl sm:blur-3xl"
              style={{ borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%" }}
            />
          </div>

          <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[300px]">
            <FloatingTechIcons />
            {/* Outer glow + dual glass rings */}
            <div
              className="absolute inset-0 rounded-[2.35rem] sm:rounded-[2.55rem]"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.5), 0 0 48px -8px rgba(124,58,237,0.45), 0 0 64px -12px rgba(37,99,235,0.35)",
              }}
              aria-hidden
            />
            <div className="absolute inset-1 rounded-[2.2rem] border border-white/70 bg-white/25 shadow-inner shadow-white/40 backdrop-blur-md sm:inset-1.5 sm:rounded-[2.4rem]" />
            <div className="absolute inset-3 overflow-hidden rounded-[2rem] border border-white/90 bg-gradient-to-br from-white/65 via-white/40 to-violet-100/30 shadow-xl shadow-violet-500/25 ring-[3px] ring-white/50 backdrop-blur-md sm:inset-4 sm:rounded-[2.25rem]">
              <SafeImage
                src={resolvedHeroImageSrc}
                alt="MD RAKIB HOSSAIN — Flutter app developer"
                fill
                className="object-contain object-center p-1.5 sm:p-2"
                priority
                sizes="(max-width: 1024px) 85vw, 300px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
