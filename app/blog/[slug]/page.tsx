import type { Metadata } from "next";
import { BlogPostPageClient } from "@/components/blog/blog-post-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog post",
  description: "Article with views and reactions stored in your browser.",
};

export default function BlogPostPage() {
  return <BlogPostPageClient />;
}
