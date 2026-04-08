"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProjectStarButton } from "@/components/projects/project-star-button";
import { SafeImage } from "@/components/SafeImage";
import { HorizontalScrollHint } from "@/components/ui/horizontal-scroll-hint";
import { useSiteData } from "@/components/site-data-provider";
import { cn } from "@/lib/utils";

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-5", className)}
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

export function ProjectDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { projects } = useSiteData();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | MD RAKIB HOSSAIN`;
    }
  }, [project]);

  if (!id) notFound();
  if (!project) notFound();

  const md = project.detailMarkdown?.trim();
  const gallery = project.gallery?.filter(Boolean) ?? [];
  const slug = project.title ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : project.id;
  const shortLink = `${typeof window !== "undefined" ? window.location.origin : ""}/projects/${slug}`;
  const [shareTooltip, setShareTooltip] = useState(false);

  // Unique tags for display
  const uniqueTags = Array.from(new Set(project.tags ?? []));

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `Check out this project by MD Rakib Hossain: ${project.title}`,
        url: shortLink,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shortLink);
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    }
  };

  return (
    <article className="border-b border-white/40 pb-8 sm:pb-12">
      <div className="mx-auto max-w-3xl px-3 pt-4 sm:px-6 lg:px-8 lg:pt-8">
        <nav className="text-xs sm:text-sm">
          <Link
            href="/#projects"
            className="font-medium text-violet-700 transition hover:underline"
          >
            ← Featured projects
          </Link>
        </nav>

        {/* Headline (Main Title) and Share Button */}
        <div className="relative flex items-center mt-8">
          <h1 className="flex-1 text-3xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-4xl md:text-5xl">
            {project.title}
          </h1>
          <button
            onClick={handleShare}
            title="Share project"
            aria-label="Share project"
            className="ml-4 h-10 w-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md border border-white/30 text-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            type="button"
          >
            <ShareIcon />
          </button>
          {shareTooltip && (
            <span className="absolute top-12 right-0 bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow">
              Link copied!
            </span>
          )}
        </div>

        {/* Caption (Summary) */}
        {project.description && (
          <p className="mt-3 text-lg text-slate-700 sm:text-xl md:text-2xl line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Metrics & Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-white/20 pb-6">
          <ProjectStarButton
            projectId={project.id}
            baseStars={project.stars}
            size="md"
            className="min-h-[44px] sm:min-h-0"
          />
        </div>

        {/* Gallery */}
        <section className="mt-8 sm:mt-10" aria-label="Project screenshots">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Gallery</h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Swipe or scroll to explore screenshots</p>
          {gallery.length > 0 ? (
            <HorizontalScrollHint
              className="mt-3 sm:mt-4"
              hintLabel="Swipe or scroll to see more screenshots"
              scrollClassName="-mx-1 px-1 pb-2 pt-1 sm:-mx-0 sm:px-0"
            >
              <div className="flex w-max gap-3 sm:gap-4">
                {gallery.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className={cn(
                      "relative w-[min(180px,46vw)] shrink-0 overflow-hidden rounded-2xl sm:w-[min(200px,40vw)]",
                      "border border-white/70 bg-white/40 shadow-md shadow-slate-900/10",
                      "aspect-[9/16]",
                    )}
                  >
                    <SafeImage
                      src={src}
                      alt={`${project.title} screenshot ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                ))}
              </div>
            </HorizontalScrollHint>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-violet-200/80 bg-violet-50/40 px-4 py-10 text-center text-sm text-slate-600 backdrop-blur-sm">
              No screenshots yet. Add image URLs in <strong>Admin → Projects</strong>.
            </p>
          )}
        </section>

        {/* Tags */}
        {uniqueTags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 line-clamp-2">
            {uniqueTags.map((t, i) => (
              <span
                key={`${project.id}-${t}-${i}`}
                className="rounded-full border border-violet-200/80 bg-violet-50/80 px-2 py-0.5 text-[11px] font-medium text-violet-800 sm:px-2.5 sm:text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Full Description */}
        {md && (
          <div className="prose prose-slate mt-10 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-violet-700 prose-a:underline hover:prose-a:text-violet-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
          </div>
        )}

        {/* Centered Action Buttons */}
        <div className="mt-8 flex w-full justify-center items-center gap-4">
          <a
            href={project.liveUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-500 min-w-[110px]"
          >
            Live Demo
          </a>
          <a
            href={project.codeUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-center text-sm font-semibold text-violet-400 hover:bg-violet-500/20 min-w-[110px]"
          >
            Source Code
          </a>
        </div>

        <footer className="mt-10 border-t border-white/50 pt-6 sm:mt-12 sm:pt-8">
          <Link
            href="/#projects"
            className="text-sm font-semibold text-violet-700 hover:underline"
          >
            ← Back to projects
          </Link>
        </footer>
      </div>
    </article>
  );
}
