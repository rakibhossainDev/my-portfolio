import projectsJson from "./projects.json";

/**
 * Featured projects for the landing grid and `/projects/[id]` detail pages.
 */
export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  liveUrl: string;
  codeUrl: string;
  /** Optional public share / case-study URL (admin UI) */
  shareUrl?: string;
  /** GitHub-style star count (display only). */
  stars: number;
  /** Mobile screenshot gallery URLs (9:16 framing on detail page). */
  gallery: string[];
  /** Markdown body for the project detail page. */
  detailMarkdown: string;
};

/** Ensures newer fields exist when loading from older JSON or localStorage. */
export function normalizeProject(p: Partial<Project> & Pick<Project, "id">): Project {
  return {
    id: p.id,
    title: p.title ?? "",
    description: p.description ?? "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    imageSrc: p.imageSrc ?? "/placeholder-project.svg",
    imageAlt: p.imageAlt ?? "",
    liveUrl: p.liveUrl ?? "#",
    codeUrl: p.codeUrl ?? "#",
    shareUrl: p.shareUrl,
    stars: typeof p.stars === "number" && Number.isFinite(p.stars) ? Math.max(0, Math.floor(p.stars)) : 0,
    gallery: Array.isArray(p.gallery) ? p.gallery.filter((u) => typeof u === "string" && u.trim()) : [],
    detailMarkdown: typeof p.detailMarkdown === "string" ? p.detailMarkdown : "",
  };
}

export const projects: Project[] = (projectsJson as Project[]).map((row) => normalizeProject(row));
