/** Bundled SVG data-URL — used when `/placeholder-fallback.svg` is also missing (extreme edge case). */
export const INLINE_IMAGE_FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect fill="#e2e8f0" width="400" height="240"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="13">Image unavailable</text></svg>`,
  );

/** Default file fallback under `/public` — keep this file in the repo. */
export const FILE_FALLBACK = "/placeholder-fallback.svg";

/**
 * Normalizes image `src` from CMS/Supabase. Empty strings fall back immediately.
 * TODO: When loading from Supabase, pass `row.cover_url` etc. through this on the server if you want SSR defaults.
 */
export function normalizeImageSrc(src: string | null | undefined): string {
  const s = src?.trim();
  if (!s) return FILE_FALLBACK;
  return s;
}

/** Remote URLs and `blob:` (IndexedDB uploads) need native `<img>`. */
export function isRemoteImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith("blob:");
}
