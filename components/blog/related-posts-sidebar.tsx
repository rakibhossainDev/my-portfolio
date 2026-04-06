"use client";

import Link from "next/link";
import { usePreferences } from "@/components/preferences-provider";
import { useState, useEffect } from "react";
import type { BlogPost } from "@/data/blog";
import { SafeImage } from "@/components/SafeImage";

interface RelatedPostsSidebarProps {
  currentSlug: string;
  allPosts: BlogPost[];
  category?: string;
}

export function RelatedPostsSidebar({
  currentSlug,
  allPosts,
  category,
}: RelatedPostsSidebarProps) {
  const { locale } = usePreferences();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const bn = isMounted ? locale === "bn" : false;

  // Get related posts: same category or latest posts (excluding current)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const sameCategory = relatedPosts.filter((p) =>
    category ? p.category === category || p.categoryBn === category : false
  );

  const postsToShow = sameCategory.length > 0 ? sameCategory : relatedPosts;

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-pink-50/90 to-violet-50/90 p-4 backdrop-blur-sm shadow-lg">
        <h3 className="font-semibold text-gray-800">
          {bn ? "সম্পর্কিত পোস্ট" : "Related Posts"}
        </h3>

        <div className="mt-4 space-y-3">
          {postsToShow.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border border-gray-200/50 bg-white/60 p-3 transition hover:bg-white/80 hover:shadow-md"
            >
              <div className="flex gap-3">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                  <SafeImage
                    src={post.imageSrc}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-violet-600">
                    {bn ? post.titleBn && post.titleBn : post.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(post.date).toLocaleDateString(bn ? "bn-BD" : "en-US")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
