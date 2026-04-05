import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import type { Project } from "@/data/projects";
import { GlassCard } from "@/components/cards/GlassCard";
import { ProjectStarButton } from "@/components/projects/project-star-button";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  );
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const detailHref = `/projects/${project.id}`;

  return (
    <GlassCard className={cn("group flex h-full flex-col overflow-hidden p-0", className)}>
      <div className="relative">
        <Link
          href={detailHref}
          className="relative block aspect-[16/10] overflow-hidden bg-slate-200/80 outline-none ring-violet-400/0 transition focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label={`Open ${project.title} case study`}
        >
          <SafeImage
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 transition group-hover:opacity-100" />
        </Link>
        <ProjectStarButton
          projectId={project.id}
          baseStars={project.stars}
          size="sm"
          className="absolute right-2 top-2 z-20 sm:right-3 sm:top-3"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col bg-white/30 p-4 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
          <Link
            href={detailHref}
            className="transition hover:text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-violet-200/80 bg-violet-50/80 px-2.5 py-0.5 text-xs font-medium text-violet-700 backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/50 pt-3 sm:mt-5 sm:pt-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive text-blue-600 hover:text-blue-700"
            >
              Live Demo
            </a>
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive text-violet-600 hover:text-violet-700"
            >
              Code
            </a>
            <Link
              href={detailHref}
              className="btn-interactive font-semibold text-slate-800 hover:text-violet-700"
            >
              Details
            </Link>
          </div>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm backdrop-blur-md hover:border-violet-300 hover:text-violet-700"
            aria-label={`Open live demo: ${project.title}`}
          >
            <ExternalIcon />
          </a>
        </div>
      </div>
    </GlassCard>
  );
}
