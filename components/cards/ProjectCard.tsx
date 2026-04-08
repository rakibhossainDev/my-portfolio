import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import type { Project } from "@/data/projects";
import { GlassCard } from "@/components/cards/GlassCard";
import { ProjectStarButton } from "@/components/projects/project-star-button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const detailHref = `/projects/${project.id}`;
  const [shareTooltip, setShareTooltip] = useState(false);
  const router = useRouter();
  const slug = project.title ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : project.id;
  const shortLink = `${typeof window !== "undefined" ? window.location.origin : ""}/projects/${slug}`;

  // Ensure unique tags
  const uniqueTags = Array.from(new Set(project.tags ?? []));

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `Check out this project by MD Rakib Hossain: ${project.title}`,
        url: shortLink,
      }).catch((err) => console.log("Share cancelled:", err));
    } else {
      navigator.clipboard.writeText(shortLink);
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (tag === "button" || tag === "a" || (e.target as HTMLElement).closest("button, a")) return;
    router.push(detailHref);
  };

  return (
    <GlassCard
      className={cn(
        // mobile-first fixed min-height so buttons remain visible; desktop reverts to natural height
        "relative group flex h-full flex-col overflow-hidden p-0 rounded-3xl shadow-lg transition-shadow hover:shadow-2xl min-h-[480px] md:min-h-0",
        className
      )}
      onClick={handleCardClick}
      role="button"
      aria-label={`View details for ${project.title}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCardClick(e as any); }}
    >
      {/* Top overlay: star badge (left) and share icon (right) over the image */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-start justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <ProjectStarButton
            projectId={project.id}
            baseStars={project.stars}
            size="sm"
            className="bg-white/20 backdrop-blur-md border-white/30"
          />
        </div>
        <div className="pointer-events-auto relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShare();
            }}
            title="Share project"
            aria-label="Share project"
            className="h-10 w-10 rounded-full inline-flex items-center justify-center bg-white/80 backdrop-blur-md border border-white/30 text-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ShareIcon />
          </button>
          {shareTooltip && (
            <div className="absolute right-0 top-12 whitespace-nowrap rounded-md bg-zinc-800 px-2 py-1 text-xs text-white shadow-md animate-in fade-in zoom-in duration-200">
              Link Copied!
            </div>
          )}
        </div>
      </div>

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
      </div>

      <div className="relative z-10 flex flex-1 flex-col min-h-0 bg-white/30 p-4 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
          <Link
            href={detailHref}
            className="transition hover:text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-3 overflow-hidden">{project.description}</p>

        <div className="mt-2 sm:mt-4">
          <div className="flex gap-2 overflow-x-auto flex-nowrap pb-2 sm:overflow-visible sm:flex-wrap sm:pb-0 line-clamp-2">
            {uniqueTags.map((t, i) => (
              <span
                key={`${project.id}-${t}-${i}`}
                className="flex-shrink-0 inline-block rounded-full border border-violet-200/80 bg-violet-50/80 px-2.5 py-0.5 text-xs font-medium text-violet-700 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons row: pinned to bottom, compact on mobile (icons only), full on md+ */}
        <div className="mt-auto w-full">
          <div className="flex flex-wrap w-full justify-center items-center gap-3 px-4 pb-4 pt-3 sm:gap-4 sm:px-6">
            <a
              href={project.liveUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[110px] whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-500"
              onClick={(e) => e.stopPropagation()}
            >
              Live Demo
            </a>
            <a
              href={project.codeUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[110px] whitespace-nowrap flex items-center justify-center rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-center text-sm font-semibold text-violet-400 hover:bg-violet-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="inline-flex items-center gap-1">
                <GitHubIcon /> Source
              </span>
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
