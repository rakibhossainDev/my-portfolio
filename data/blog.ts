import blogJson from "./blog.json";

/**
 * Blog posts for the home grid and `/blog/[slug]` pages.
 * TODO: Replace with Supabase/CMS, e.g. `supabase.from('posts').select('*').order('date', { ascending: false })`
 */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  titleBn?: string;
  date: string;
  excerpt: string;
  excerptBn?: string;
  imageSrc: string;
  imageAlt: string;
  content: string[];
  category?: string;
  categoryBn?: string;
  shortLink?: string;
};

export const blogPosts: BlogPost[] = blogJson as BlogPost[];
