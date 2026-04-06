"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogPostHeaderEngagement } from "@/components/blog/blog-post-header-engagement";
import { BlogReactions } from "@/components/blog/blog-reactions";
import { BlogSharing } from "@/components/blog/blog-sharing";
import { BlogAdPlaceholder } from "@/components/blog/blog-ad-placeholder";
import { RelatedPostsSidebar } from "@/components/blog/related-posts-sidebar";
import { BilingualToggle } from "@/components/blog/bilingual-toggle";
import { DynamicAd } from "@/components/blog/dynamic-ad";
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
  const { locale, setLocale } = usePreferences();
  const [isMounted, setIsMounted] = useState(false);
  const post = blogs.find((p) => p.slug === slug);
  
  // Only use actual locale after mount to prevent hydration mismatch
  const bn = isMounted ? locale === "bn" : false;
  
  const title = post ? (bn ? (post.titleBn?.trim() || post.title) : post.title) : "";
  const excerpt = post ? (bn ? (post.excerptBn?.trim() || post.excerpt) : post.excerpt) : "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handleLocaleToggle = (newLocale: "en" | "bn") => {
    setLocale(newLocale);
  };

  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  const relatedPosts = post.category
    ? blogs.filter((b) => b.slug !== slug && b.category === post.category)
    : [];

  return (
    <article className="border-b border-white/40 pb-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-3 pt-8 lg:grid-cols-4 lg:gap-12 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <nav className="text-sm">
            <Link
              href="/#blog"
              className="font-medium text-violet-700 transition hover:underline"
            >
              {backBlog}
            </Link>
          </nav>

          <header className="mt-8 border-b border-white/50 pb-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  {post.category ? (bn ? "বিভাগ" : "Category") : "Newsletter"}
                </p>
                {post.category && (
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {bn ? post.categoryBn || post.category : post.category}
                  </p>
                )}
              </div>
              {isMounted && (
                <BilingualToggle
                  currentLocale={locale}
                  onToggle={handleLocaleToggle}
                  className="flex-shrink-0"
                />
              )}
            </div>
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

          {/* Reactions */}
          <div className="mt-12 flex items-center gap-4 border-y border-white/30 py-6">
            <span className="text-sm font-medium text-slate-600">
              {bn ? "আপনার প্রতিক্রিয়া" : "Your reaction"}
            </span>
            <BlogReactions slug={post.slug} className="flex gap-2" />
          </div>

          {/* Blog Sharing */}
          <div className="mt-10">
            <BlogSharing
              title={title}
              url={postUrl}
              className="flex items-center gap-3 flex-wrap"
            />
          </div>

          {/* Dynamic Ad */}
          <div className="mt-12">
            <DynamicAd />
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

        {/* Sidebar - Related Posts */}
        <div className="hidden lg:block lg:col-span-1">
          <RelatedPostsSidebar
            currentSlug={post.slug}
            allPosts={relatedPosts.length > 0 ? relatedPosts : blogs.slice(0, 5)}
            category={post.category}
          />
        </div>
      </div>
    </article>
  );
}
