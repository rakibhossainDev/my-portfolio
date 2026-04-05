"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProjectStarButton } from "@/components/projects/project-star-button";
import { SafeImage } from "@/components/SafeImage";
import { HorizontalScrollHint } from "@/components/ui/horizontal-scroll-hint";
import { useSiteData } from "@/components/site-data-provider";
import { cn } from "@/lib/utils";

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

        <section className="mt-5 sm:mt-6" aria-label="Mobile screenshots">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Screenshots</h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Mobile frames (9:16) — swipe to explore</p>
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

        <header className="mt-8 border-b border-white/50 pb-6 sm:mt-10 sm:pb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <ProjectStarButton
              projectId={project.id}
              baseStars={project.stars}
              size="md"
              className="min-h-[44px] sm:min-h-0"
            />
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-violet-200/80 bg-violet-50/80 px-2 py-0.5 text-[11px] font-medium text-violet-800 sm:px-2.5 sm:text-xs"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-3xl md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold sm:gap-4">
            <a
              href={project.liveUrl}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo
            </a>
            <a
              href={project.codeUrl}
              className="text-violet-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
            {project.shareUrl ? (
              <a
                href={project.shareUrl}
                className="text-slate-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Share
              </a>
            ) : null}
          </div>
        </header>

        <div className="markdown-detail mt-8 max-w-none scroll-mt-24 sm:mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {md && md.length > 0 ? md : "_Add a detailed description in **Admin → Projects** (Markdown supported)._"}
          </ReactMarkdown>
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
