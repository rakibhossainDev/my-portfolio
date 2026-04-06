"use client";

import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/SafeImage";
import {
  getProjectDisplayStars,
  isProjectStarred,
  toggleProjectStar,
} from "@/lib/engagement-storage";
import { useEngagementSync } from "@/hooks/use-engagement-sync";
import { useState, useEffect } from "react";
import type { Project } from "@/data/projects";

interface ProjectGridProps {
  projects: Project[];
  layout?: "grid" | "carousel";
}

interface ProjectStarState {
  [projectId: string]: {
    isStarred: boolean;
    displayStars: number;
  };
}

export function ProjectGrid({ projects, layout = "grid" }: ProjectGridProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [starStates, setStarStates] = useState<ProjectStarState>({});
  const engagementVersion = useEngagementSync();

  // Initialize star states on client mount to avoid hydration mismatch
  useEffect(() => {
    const newStarStates: ProjectStarState = {};
    projects.forEach((project) => {
      newStarStates[project.id] = {
        isStarred: isProjectStarred(project.id),
        displayStars: getProjectDisplayStars(project.stars, project.id),
      };
    });
    setStarStates(newStarStates);
    setIsMounted(true);
  }, [projects, engagementVersion]);

  const handleStar = (projectId: string) => {
    toggleProjectStar(projectId);
    setStarStates((prev) => ({
      ...prev,
      [projectId]: {
        isStarred: !prev[projectId].isStarred,
        displayStars: getProjectDisplayStars(
          projects.find((p) => p.id === projectId)?.stars || 0,
          projectId
        ),
      },
    }));
  };

  // Determine grid layout based on number of projects and layout type
  const projectCount = projects.length;
  const isCentered = projectCount <= 2;

  const gridClass =
    layout === "carousel"
      ? "grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-4 scrollbar-hide"
      : projectCount <= 2
      ? "flex justify-center flex-wrap gap-6 lg:gap-8"
      : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8";

  return layout === "carousel" ? (
    <div className="flex items-center gap-4">
      {/* Left Arrow */}
      <button
        className="shrink-0 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-400"
        onClick={() => {
          const container = document.querySelector('.carousel-container');
          if (container) {
            container.scrollBy({ left: -320, behavior: 'smooth' });
          }
        }}
        aria-label="Scroll left"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="carousel-container flex-1 grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {projects.map((project) => {
          const starState = starStates[project.id] || {
            isStarred: false,
            displayStars: String(project.stars || 0),
          };
          const { isStarred, displayStars } = starState;

          return (
            <div
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="group flex min-w-[280px] max-w-[320px] flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_80px_-58px_rgba(15,23,42,0.7)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <SafeImage
                  src={project.imageSrc}
                  alt={project.imageAlt || project.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col gap-4 bg-white p-5 sm:p-6">
                <div className="space-y-2.5">
                  <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    {project.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {project.description}
                  </p>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:pt-5">
                  <div className="flex flex-wrap gap-3">
                    {project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                      >
                        <span>Demo</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {project.codeUrl !== "#" && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        <span>Code</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStar(project.id);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
                  >
                    <svg
                      className={`h-4 w-4 fill-current transition ${
                        isStarred ? "text-amber-400" : "text-slate-400"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{displayStars} stars</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        className="shrink-0 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-400"
        onClick={() => {
          const container = document.querySelector('.carousel-container');
          if (container) {
            container.scrollBy({ left: 320, behavior: 'smooth' });
          }
        }}
        aria-label="Scroll right"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  ) : (
    <div className={gridClass}>
      {projects.map((project) => {
        const starState = starStates[project.id] || {
          isStarred: false,
          displayStars: String(project.stars || 0),
        };
        const { isStarred, displayStars } = starState;

        return (
          <div
            key={project.id}
            onClick={() => router.push(`/projects/${project.id}`)}
            className={`group flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_80px_-58px_rgba(15,23,42,0.7)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${
              projectCount <= 2 ? "max-w-sm" : ""
            }`}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <SafeImage
                src={project.imageSrc}
                alt={project.imageAlt || project.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 bg-white p-5 sm:p-6">
              <div className="space-y-2.5">
                <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {project.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {project.description}
                </p>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:pt-5">
                <div className="flex flex-wrap gap-3">
                  {project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                      <span>Demo</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.codeUrl !== "#" && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <span>Code</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleStar(project.id);
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
                >
                  <svg
                    className={`h-4 w-4 fill-current transition ${
                      isStarred ? "text-amber-400" : "text-slate-400"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{displayStars} stars</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
