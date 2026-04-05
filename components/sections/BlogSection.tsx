"use client";

import { BlogCard } from "@/components/cards/BlogCard";
import { HorizontalScrollHint } from "@/components/ui/horizontal-scroll-hint";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { blogSectionBn } from "@/data/translations";

export function BlogSection() {
  const { locale } = usePreferences();
  const { blogs, sectionTaglines } = useSiteData();
  const bn = locale === "bn";

  const heading = bn ? blogSectionBn.heading : "Blog";
  const sub = bn ? sectionTaglines.blogSubBn : sectionTaglines.blogSubEn;

  return (
    <section
      id="blog"
      className="scroll-mt-24 border-t border-white/40 bg-white/15 py-6 backdrop-blur-sm sm:py-8 md:py-9"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">{heading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">{sub}</p>
        </header>

        <HorizontalScrollHint
          className="mt-5 sm:mt-6"
          hintLabel="Scroll sideways for more posts"
          showScrollButtons
          scrollClassName="-mx-1 px-1 pb-1 sm:-mx-0 sm:px-0"
        >
          <ul className="flex w-max gap-4 pb-2 sm:gap-6">
            {blogs.map((post) => (
              <li key={post.id} className="w-[min(100vw-2.5rem,300px)] shrink-0 sm:w-[300px]">
                <article className="h-full">
                  <BlogCard post={post} className="h-full" />
                </article>
              </li>
            ))}
          </ul>
        </HorizontalScrollHint>
      </div>
    </section>
  );
}
