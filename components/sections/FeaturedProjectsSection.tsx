"use client";

import { ProjectGrid } from "@/components/projects/project-grid";
import { HorizontalScrollHint } from "@/components/ui/horizontal-scroll-hint";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { site } from "@/data/site";
import { homeUiBn } from "@/data/translations";
import { useState, useEffect } from "react";

export function FeaturedProjectsSection() {
  const { locale } = usePreferences();
  const { projects, sectionTaglines } = useSiteData();
  const [isMounted, setIsMounted] = useState(false);

  // Only render with actual locale after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const bn = isMounted ? locale === "bn" : false;

  const heading = bn ? homeUiBn.featuredHeading : "Featured Projects";
  const sub = bn ? sectionTaglines.projectsSubBn : sectionTaglines.projectsSubEn;
  const viewGithub = bn ? homeUiBn.viewGithub : "View More on GitHub";

  return (
    <section
      id="projects"
      className="scroll-mt-24 py-6 sm:py-8 md:py-9"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              {heading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">{sub}</p>
          </div>
        </header>

        <div className="mt-8 sm:mt-10">
          <HorizontalScrollHint
            hintLabel="Scroll sideways to see more projects"
            showScrollButtons
            scrollClassName="-mx-1 px-1 pb-1 sm:-mx-0 sm:px-0"
          >
            <ProjectGrid projects={projects} layout="carousel" />
          </HorizontalScrollHint>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <a
            href={site.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-white/70 bg-white/50 px-5 py-3 text-sm font-semibold text-slate-800 shadow-md backdrop-blur-md hover:border-violet-300 hover:text-violet-700 sm:w-auto sm:max-w-none sm:px-6"
          >
            {viewGithub}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
