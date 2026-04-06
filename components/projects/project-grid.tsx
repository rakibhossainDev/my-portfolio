"use client";

import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/SafeImage";
import { GlassCard } from "@/components/cards/GlassCard";
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

      <div className="carousel-container flex-1 flex flex-wrap gap-4 overflow-x-auto pb-4 scrollbar-hide">
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
              className="group flex min-w-[min(100vw-2.5rem,300px)] sm:min-w-[300px] max-w-[320px] flex-col overflow-hidden cursor-pointer shrink-0"
            >
              <GlassCard className="flex h-full flex-col overflow-hidden p-0">
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-white/50 bg-slate-100/50">
                  <SafeImage
                    src={project.imageSrc}
                    alt={project.imageAlt || project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                      {project.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {project.description}
                    </p>
                  </div>
                  {project.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-violet-200/80 bg-violet-50/80 px-2.5 py-0.5 text-xs font-medium text-violet-700 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/50 pt-3 sm:mt-4 sm:pt-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn-interactive text-blue-600 hover:text-blue-700"
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn-interactive text-violet-600 hover:text-violet-700"
                    >
                      Code
                    </a>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStar(project.id);
                    }}
                    className="btn-interactive shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    <svg
                      className={`h-3.5 w-3.5 fill-current transition ${
                        isStarred ? "text-amber-400" : "text-slate-400"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{displayStars}</span>
                  </button>
                </div>
              </GlassCard>
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
            className={`group flex flex-col overflow-hidden cursor-pointer ${
              projectCount <= 2 ? "max-w-sm" : ""
            }`}
          >
            <GlassCard className="flex h-full flex-col overflow-hidden p-0">
              <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-white/50 bg-slate-100/50">
                <SafeImage
                  src={project.imageSrc}
                  alt={project.imageAlt || project.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                    {project.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {project.description}
                  </p>
                </div>
                {project.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-violet-200/80 bg-violet-50/80 px-2.5 py-0.5 text-xs font-medium text-violet-700 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/50 pt-3 sm:mt-4 sm:pt-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn-interactive text-blue-600 hover:text-blue-700"
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn-interactive text-violet-600 hover:text-violet-700"
                    >
                      Code
                    </a>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStar(project.id);
                    }}
                    className="btn-interactive shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    <svg
                      className={`h-3.5 w-3.5 fill-current transition ${
                        isStarred ? "text-amber-400" : "text-slate-400"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{displayStars}</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      })}
    </div>
  );
}
