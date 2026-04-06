/**
 * Client-only engagement state (stars, blog views, blog reactions).
 * Persists in localStorage; blog views increment once per browser session per slug.
 */

const PROJECT_STARS_KEY = "rh-project-stars-v1";
const BLOG_VIEWS_KEY = "rh-blog-views-v1";
const BLOG_LOVE_KEY = "rh-blog-love-v1";
const BLOG_REACTIONS_KEY = "rh-blog-reactions-v2";
const SESSION_VIEW_PREFIX = "rh-blog-viewed-session:";

export type ReactionType = "like" | "celebrate" | "support" | "love" | "insightful" | "funny";

export const ENGAGEMENT_CHANGED_EVENT = "rh-engagement-changed";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ENGAGEMENT_CHANGED_EVENT));
  }
}

function parseStringArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Project IDs this device has starred (+1 each toward CMS base count). */
export function getStarredProjectIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  return new Set(parseStringArray(localStorage.getItem(PROJECT_STARS_KEY)));
}

export function isProjectStarred(projectId: string): boolean {
  return getStarredProjectIds().has(projectId);
}

/** Toggle star for this device. Returns new starred state. */
export function toggleProjectStar(projectId: string): boolean {
  const next = new Set(getStarredProjectIds());
  if (next.has(projectId)) next.delete(projectId);
  else next.add(projectId);
  localStorage.setItem(PROJECT_STARS_KEY, JSON.stringify([...next]));
  notify();
  return next.has(projectId);
}

export function getProjectDisplayStars(baseStars: number, projectId: string): number {
  const b = typeof baseStars === "number" && Number.isFinite(baseStars) ? Math.max(0, Math.floor(baseStars)) : 0;
  if (typeof window === "undefined") return b;
  return b + (isProjectStarred(projectId) ? 1 : 0);
}

function readBlogViewsMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BLOG_VIEWS_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const n = typeof val === "number" ? val : Number(val);
      if (Number.isFinite(n) && n >= 0) out[k] = Math.floor(n);
    }
    return out;
  } catch {
    return {};
  }
}

function writeBlogViewsMap(map: Record<string, number>) {
  localStorage.setItem(BLOG_VIEWS_KEY, JSON.stringify(map));
  notify();
}

export function getBlogViewCount(slug: string): number {
  return readBlogViewsMap()[slug] ?? 0;
}

/** Increment views once per tab session per slug; returns new total. */
export function recordBlogViewIfNewSession(slug: string): number {
  if (typeof window === "undefined") return 0;
  const sessKey = SESSION_VIEW_PREFIX + slug;
  try {
    if (sessionStorage.getItem(sessKey)) {
      return getBlogViewCount(slug);
    }
  } catch {
    /* private mode */
  }
  const map = readBlogViewsMap();
  map[slug] = (map[slug] ?? 0) + 1;
  writeBlogViewsMap(map);
  try {
    sessionStorage.setItem(sessKey, "1");
  } catch {
    /* ignore */
  }
  return map[slug];
}

function getLovedBlogSlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  return new Set(parseStringArray(localStorage.getItem(BLOG_LOVE_KEY)));
}

export function isBlogLoved(slug: string): boolean {
  return getLovedBlogSlugs().has(slug);
}

export function toggleBlogLove(slug: string): boolean {
  const next = new Set(getLovedBlogSlugs());
  if (next.has(slug)) next.delete(slug);
  else next.add(slug);
  localStorage.setItem(BLOG_LOVE_KEY, JSON.stringify([...next]));
  notify();
  return next.has(slug);
}

/** Per-device reaction count (0 or 1) for display next to Love. */
export function getBlogLoveCountForDevice(slug: string): number {
  return isBlogLoved(slug) ? 1 : 0;
}

/** Multi-reaction system */
function readBlogReactionsMap(): Record<string, Record<ReactionType, boolean>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BLOG_REACTIONS_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return {};
    return v as Record<string, Record<ReactionType, boolean>>;
  } catch {
    return {};
  }
}

function writeBlogReactionsMap(map: Record<string, Record<ReactionType, boolean>>) {
  localStorage.setItem(BLOG_REACTIONS_KEY, JSON.stringify(map));
  notify();
}

export function getUserReaction(slug: string): ReactionType | null {
  const map = readBlogReactionsMap();
  const reactions = map[slug];
  if (!reactions) return null;
  for (const type of ["like", "celebrate", "support", "love", "insightful", "funny"] as ReactionType[]) {
    if (reactions[type]) return type;
  }
  return null;
}

export function setUserReaction(slug: string, reactionType: ReactionType | null): ReactionType | null {
  const map = readBlogReactionsMap();
  if (!map[slug]) map[slug] = {} as Record<ReactionType, boolean>;
  
  for (const type of ["like", "celebrate", "support", "love", "insightful", "funny"] as ReactionType[]) {
    map[slug][type] = type === reactionType;
  }
  
  writeBlogReactionsMap(map);
  return reactionType;
}
