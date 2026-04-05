import type { Metadata } from "next";
import { ProjectDetailPage } from "@/components/projects/project-detail-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project",
  description: "Mobile screenshots, Markdown case study, and interactive stars (saved per device in localStorage).",
};

export default function ProjectPage() {
  return <ProjectDetailPage />;
}
