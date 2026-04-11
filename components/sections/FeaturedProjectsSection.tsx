"use client";

import { ProjectCard } from "@/components/cards/ProjectCard";
import { HorizontalScrollHint } from "@/components/ui/horizontal-scroll-hint";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { site } from "@/data/site";
import { homeUiBn } from "@/data/translations";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FeaturedProjectsSection() {
  const { locale } = usePreferences();
  const { projects, sectionTaglines, hydrated } = useSiteData();
  const [isMounted, setIsMounted] = useState(false);

  // Only render with actual locale after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const bn = isMounted ? locale === "bn" : false;
  const ready = isMounted && hydrated;

  const heading = bn ? homeUiBn.featuredHeading : "Featured Projects";
  const sub = bn ? sectionTaglines.projectsSubBn : sectionTaglines.projectsSubEn;
  const viewGithub = bn ? homeUiBn.viewGithub : "View More on GitHub";

  return (
    <section
      id="projects"
      className="scroll-mt-24 py-6 sm:py-8 md:py-9"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className={cn("transition-all duration-700", ready ? "fade-in-content" : "opacity-0")}>
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full">
              {!ready ? (
                <Skeleton className="h-10 w-48" />
              ) : (
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                  {heading}
                </h2>
              )}
              <div className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg" suppressHydrationWarning>
                {!ready ? <Skeleton className="h-7 w-full max-w-lg" /> : sub}
              </div>
            </div>
          </header>

          <div className="mt-8 sm:mt-10">
            <HorizontalScrollHint
              className="mt-5 sm:mt-6"
              hintLabel="Scroll sideways to see more projects"
              showScrollButtons
              scrollClassName="-mx-1 px-1 pb-1 sm:-mx-0 sm:px-0"
            >
              <ul className="flex w-max gap-4 pb-2 sm:gap-6">
                {!ready ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="w-[min(100vw-2.5rem,300px)] shrink-0 sm:w-[300px]">
                        <div className="h-64 h-full rounded-2xl border border-white/50 bg-white/20 overflow-hidden">
                          <Skeleton className="h-full w-full" />
                        </div>
                      </li>
                    ))}
                  </>
                ) : (
                  projects.map((project) => (
                    <li key={project.id} className="w-[min(100vw-2.5rem,300px)] shrink-0 sm:w-[300px]">
                      <article className="h-full">
                        <ProjectCard project={project} className="h-full" />
                      </article>
                    </li>
                  ))
                )}
              </ul>
            </HorizontalScrollHint>
          </div>

          <div className="mt-8 flex justify-center sm:mt-10">
            {!ready ? (
              <Skeleton className="h-12 w-48 rounded-xl" />
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
