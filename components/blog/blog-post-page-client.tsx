"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import { BlogPostHeaderEngagement } from "@/components/blog/blog-post-header-engagement";
import { SafeImage } from "@/components/SafeImage";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function BlogPostPageClient() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { blogs } = useSiteData();
  const { locale } = usePreferences();
  const post = blogs.find((p) => p.slug === slug);
  const bn = locale === "bn";
  const title = post ? (bn ? (post.titleBn?.trim() || post.title) : post.title) : "";
  const excerpt = post ? (bn ? (post.excerptBn?.trim() || post.excerpt) : post.excerpt) : "";

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | MD RAKIB HOSSAIN`;
    }
  }, [post]);

  if (!slug) notFound();
  if (!post) notFound();

  const backBlog = bn ? "← ব্লগে ফিরে যান" : "← Back to Blog";
  const morePosts = bn ? "← আরও পোস্ট" : "← More posts";
  const loveLabel = bn ? "পছন্দ" : "Love";
  const lovedLabel = bn ? "পছন্দিত" : "Loved";
  const viewsLabel = bn ? "দর্শন" : "views";

  return (
    <article className="border-b border-white/40 pb-16">
      <div className="mx-auto max-w-3xl px-3 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <nav className="text-sm">
          <Link
            href="/#blog"
            className="font-medium text-violet-700 transition hover:underline"
          >
            {backBlog}
          </Link>
        </nav>

        <header className="mt-8 border-b border-white/50 pb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            Newsletter
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <time
            dateTime={post.date}
            className="mt-4 block text-sm text-slate-500"
          >
            {formatDate(post.date)}
          </time>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg">{excerpt}</p>
          <BlogPostHeaderEngagement
            slug={post.slug}
            labels={{ love: loveLabel, loved: lovedLabel, views: viewsLabel }}
          />
        </header>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-white/60 bg-slate-100/50 shadow-lg">
          <SafeImage
            src={post.imageSrc}
            alt={post.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>

        <div className="prose prose-slate mt-12 max-w-none">
          <div className="space-y-6 text-base leading-[1.75] text-slate-700">
            {post.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <footer className="mt-14 border-t border-white/50 pt-10">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:underline"
          >
            {morePosts}
          </Link>
        </footer>
      </div>
    </article>
  );
}
