"use client";

import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { BlogEngagementBar } from "@/components/blog/blog-engagement-bar";
import { GlassCard } from "@/components/cards/GlassCard";
import { SafeImage } from "@/components/SafeImage";
import { usePreferences } from "@/components/preferences-provider";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function BlogCard({ post, className }: BlogCardProps) {
  const { locale } = usePreferences();
  const bn = locale === "bn";
  const title = bn ? (post.titleBn?.trim() || post.title) : post.title;
  const excerpt = bn ? (post.excerptBn?.trim() || post.excerpt) : post.excerpt;
  const readMore = bn ? "আরও পড়ুন →" : "Read more →";

  return (
    <GlassCard className={cn("group flex h-full flex-col overflow-hidden p-0", className)}>
      <Link href={`/blog/${post.slug}`} className="flex min-h-0 flex-1 flex-col">
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-white/50 bg-slate-100/50">
          <SafeImage
            src={post.imageSrc}
            alt={post.imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <time
            dateTime={post.date}
            className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 sm:text-xs"
          >
            {formatDate(post.date)}
          </time>
          <h3 className="mt-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">{title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 sm:mt-3">{excerpt}</p>
          <span className="mt-3 text-sm font-medium text-violet-700 sm:mt-4">{readMore}</span>
        </div>
      </Link>
      <BlogEngagementBar slug={post.slug} />
    </GlassCard>
  );
}
