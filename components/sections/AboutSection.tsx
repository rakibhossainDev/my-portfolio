"use client";

import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { LayoutGroup, motion } from "framer-motion";
import { useId, useState } from "react";
import { GlassCard } from "@/components/cards/GlassCard";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { site } from "@/data/site";
import type { EducationCmsEntry, SkillCms } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const tabs = ["About", "Skills", "Education"] as const;
type Tab = (typeof tabs)[number];

const tabLabel: Record<Tab, { en: string; bn: string }> = {
  About: { en: "About", bn: "পরিচিতি" },
  Skills: { en: "Skills", bn: "দক্ষতা" },
  Education: { en: "Education", bn: "শিক্ষা" },
};

function GradCap({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6 shrink-0 text-violet-600", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M4.5 10.5 12 7l7.5 3.5L12 14 4.5 10.5z" />
      <path d="M9 12v4.5l3 1.5 3-1.5V12" />
      <path d="M4.5 10.5V17" />
    </svg>
  );
}

function SkillBar({ name, percent }: { name: string; percent: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-800">{name}</span>
        <span className="text-slate-500">{percent}%</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200/80 backdrop-blur-sm">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function AboutSection() {
  const [tab, setTab] = useState<Tab>("About");
  const blobClipId = useId().replace(/:/g, "");
  const { locale } = usePreferences();
  const {
    about: cms,
    sectionTaglines,
    skills,
    education,
    resolvedAboutImageSrc,
    resolvedResumeHref,
    resolvedResumeDownloadName,
    social,
  } = useSiteData();
  const bn = locale === "bn";
  const a = cms; // Use CMS data instead of static site.about

  const sectionTitle = bn ? "পরিচিতি" : "About Me";
  const sectionLead = bn ? sectionTaglines.aboutLeadBn : sectionTaglines.aboutLeadEn;

  return (
    <section id="about" className="scroll-mt-24 border-t border-white/40 bg-white/25 py-6 backdrop-blur-sm sm:py-8 md:py-9">
      <svg width={0} height={0} className="pointer-events-none fixed h-0 w-0 overflow-hidden opacity-0" aria-hidden>
        <defs>
          <clipPath id={blobClipId} clipPathUnits="objectBoundingBox">
            <path d="M0.5 0.03 C0.74 0.02 0.94 0.16 0.98 0.42 C1.02 0.62 0.93 0.86 0.71 0.96 C0.5 1.04 0.22 0.98 0.06 0.74 C-0.06 0.52 0.02 0.2 0.26 0.08 C0.34 0.05 0.42 0.03 0.5 0.03 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">{sectionTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">{sectionLead}</p>
        </header>

        {/*
          Equal-height layout (lg+):
          - Grid row height = max(left, right) intrinsic content.
          - Each column is flex + h-full so the card fills the stretched grid cell.
          - Left: photo uses flex-1 min-h-0 (no fixed flex-basis) so it grows/shrinks with the row.
          - Right: tab bar shrink-0, body flex-1 so the card matches left card height cleanly.
        */}
        <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          <div className="flex min-h-0 flex-col lg:col-span-5 lg:h-full lg:min-h-0">
            <GlassCard className="flex min-h-[200px] w-full flex-1 flex-col overflow-hidden p-0 sm:min-h-[220px] lg:min-h-0 lg:h-full">
              <div className="relative flex min-h-[200px] w-full flex-1 items-center justify-center overflow-visible bg-gradient-to-br from-violet-100/90 via-white/40 to-blue-100/90 px-4 py-8 sm:px-6 lg:min-h-[240px]">
                <div
                  className="pointer-events-none absolute aspect-square w-[min(252px,78vw)] rotate-[14deg] rounded-[2.25rem] border-2 border-dashed border-violet-400/35 bg-gradient-to-br from-violet-300/15 to-blue-300/10 shadow-inner shadow-violet-500/10"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute aspect-square w-[min(210px,68vw)] -rotate-[8deg] rounded-[1.75rem] border border-white/70 bg-white/20 shadow-lg shadow-blue-500/10 backdrop-blur-[2px]"
                  aria-hidden
                />
                <svg
                  className="pointer-events-none absolute right-[8%] top-[12%] z-10 h-8 w-8 text-blue-500/50 sm:h-10 sm:w-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M20 4 L36 20 L20 36 L4 20 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="drop-shadow-sm"
                  />
                </svg>
                <svg
                  className="pointer-events-none absolute bottom-[14%] left-[6%] z-10 h-6 w-6 text-violet-500/45 sm:h-8 sm:w-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden
                >
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 3" />
                </svg>
                <div
                  className="relative z-[5] aspect-square w-[min(220px,70vw)] shadow-2xl shadow-violet-600/20 ring-[3px] ring-white/90 sm:w-[min(230px,68vw)]"
                  style={{ clipPath: `url(#${blobClipId})` }}
                >
                  <SafeImage
                    src={resolvedAboutImageSrc}
                    alt={a.name}
                    fill
                    className="object-contain object-center bg-gradient-to-br from-white/60 to-violet-50/30 p-2"
                    sizes="(max-width: 1024px) 230px, 260px"
                  />
                </div>
              </div>
              <div className="shrink-0 space-y-3 border-t border-white/50 bg-white/35 p-4 backdrop-blur-md sm:space-y-4 sm:p-5">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">{a.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-violet-700">{a.title}</p>
                </div>
                <p className="text-sm text-slate-600">{a.location}</p>
                <a
                  href={`mailto:${a.email}`}
                  className="block text-sm font-medium text-slate-800 transition hover:text-violet-700"
                >
                  {a.email}
                </a>
                <p className="text-sm text-slate-500">{a.education}</p>

                <div className="flex flex-wrap gap-2 pt-0.5">
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/50 text-[#0A66C2] shadow-sm backdrop-blur-md hover:border-[#0A66C2]/30 hover:text-[#004182]"
                    aria-label="LinkedIn"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/50 text-slate-700 shadow-sm backdrop-blur-md hover:border-violet-300/60 hover:text-violet-700"
                    aria-label="GitHub"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </a>
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/50 text-[#1877F2] shadow-sm backdrop-blur-md hover:border-[#1877F2]/30 hover:text-[#0d5dbf]"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={`mailto:${a.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/50 text-slate-700 shadow-sm backdrop-blur-md hover:border-violet-300/60 hover:text-violet-700"
                    aria-label="Email"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>

                <a
                  href={resolvedResumeHref}
                  download={resolvedResumeDownloadName}
                  className="btn-interactive mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-white/60 bg-gradient-to-r from-violet-600/90 to-blue-600/90 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/20 ring-1 ring-white/20 backdrop-blur-sm transition hover:brightness-110 hover:shadow-lg hover:shadow-violet-500/25"
                >
                  <svg className="h-4 w-4 opacity-95" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {bn ? "রিজিউমে ডাউনলোড" : "Download Resume"}
                </a>
              </div>
            </GlassCard>
          </div>

          <div className="flex min-h-0 flex-col lg:col-span-7 lg:h-full lg:min-h-0">
            <GlassCard
              hover={false}
              className="flex min-h-0 w-full flex-1 flex-col overflow-hidden p-1 sm:p-2 lg:h-full"
            >
              <div className="shrink-0 border-b border-white/40 pb-1">
                <LayoutGroup id="about-tabs">
                  <div
                    className="relative flex flex-wrap gap-1 rounded-full border border-white/50 bg-white/35 p-1 shadow-inner shadow-white/20 backdrop-blur-xl"
                    role="tablist"
                  >
                    {tabs.map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={tab === t}
                        onClick={() => setTab(t)}
                        className={cn(
                          "btn-interactive relative z-10 min-w-[5.5rem] flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
                          tab === t ? "text-violet-800" : "text-slate-600 hover:text-slate-900",
                        )}
                      >
                        {tab === t ? (
                          <motion.span
                            layoutId="about-tab-pill"
                            className="absolute inset-0 -z-10 rounded-full border border-white/70 bg-white/80 shadow-md shadow-violet-500/15 ring-1 ring-violet-200/40 backdrop-blur-md"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        ) : null}
                        <span className="relative">{bn ? tabLabel[t].bn : tabLabel[t].en}</span>
                      </button>
                    ))}
                  </div>
                </LayoutGroup>
              </div>

              <div className="flex min-h-0 flex-1 flex-col bg-white/20 p-5 backdrop-blur-md sm:p-6">
                {tab === "About" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {bn ? "আমার পথচলা" : "My Journey"}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                      {bn ? cms.journeyBn : cms.journeyEn}
                    </p>
                    <div>
                      <h4 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                        <span aria-hidden>🚀</span> {bn ? cms.goalTitleBn : cms.goalTitleEn}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {bn ? cms.goalBn : cms.goalEn}
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                        <span aria-hidden>💡</span> {bn ? cms.visionTitleBn : cms.visionTitleEn}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {bn ? cms.visionBn : cms.visionEn}
                      </p>
                    </div>
                  </div>
                )}

                {tab === "Skills" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {bn ? "প্রযুক্তিগত দক্ষতা" : "Technical skills"}
                    </h3>
                    <div className="space-y-5">
                      {skills.map((s: SkillCms) => (
                        <SkillBar
                          key={s.id}
                          name={bn ? (s.nameBn?.trim() || s.name) : s.name}
                          percent={s.percent}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {tab === "Education" && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {bn ? "শিক্ষা" : "Education"}
                    </h3>
                    <ul className="relative mt-8 space-y-0 border-l-2 border-violet-200/80 pl-8">
                      {education.map((e: EducationCmsEntry) => (
                        <li key={e.id} className="relative pb-10 last:pb-0">
                          <span className="absolute -left-[1.125rem] top-0 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700 shadow-md backdrop-blur-sm">
                            <GradCap />
                          </span>
                          <GlassCard hover={false} className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                              {e.period}
                            </p>
                            <h4 className="mt-2 text-base font-bold text-slate-900">
                              {bn ? (e.degreeBn?.trim() || e.degree) : e.degree}
                            </h4>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {bn ? (e.institutionBn?.trim() || e.institution) : e.institution}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                              {bn ? (e.detailBn?.trim() || e.detail) : e.detail}
                            </p>
                          </GlassCard>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 lg:text-left">
          More Flutter work is in the{" "}
          <Link href="/#projects" className="font-medium text-violet-700 hover:underline">
            Featured Projects
          </Link>{" "}
          section.
        </p>
      </div>
    </section>
  );
}
