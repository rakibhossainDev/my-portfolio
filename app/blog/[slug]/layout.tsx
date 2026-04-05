import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog post",
  description: "Article from MD RAKIB HOSSAIN",
};

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
