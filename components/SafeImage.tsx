"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  FILE_FALLBACK,
  INLINE_IMAGE_FALLBACK,
  isRemoteImageSrc,
  normalizeImageSrc,
} from "@/lib/image-helpers";
import { cn } from "@/lib/utils";

type SafeImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** Parent must be `relative` with defined size */
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

/**
 * Resilient image: empty `src`, 404s, and broken remote URLs fall back to local then inline SVG.
 * Remote `http(s)` URLs render with native `<img>` so you do not need `next/image` remotePatterns
 * for every host (e.g. ad-hoc Supabase Storage URLs still work).
 *
 * You do **not** need `lucide-react` or `framer-motion` for this project — icons are inline SVG
 * and motion uses CSS (`globals.css` `.btn-interactive` / `.card-interactive`). Add those libraries
 * only if you want their specific ecosystems later.
 */
export function SafeImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: SafeImageProps) {
  const [current, setCurrent] = useState(() => normalizeImageSrc(src));

  useEffect(() => {
    setCurrent(normalizeImageSrc(src));
  }, [src]);

  const handleError = useCallback(() => {
    setCurrent((prev) => {
      if (prev === INLINE_IMAGE_FALLBACK) return prev;
      if (prev === FILE_FALLBACK) return INLINE_IMAGE_FALLBACK;
      return FILE_FALLBACK;
    });
  }, []);

  const remote = isRemoteImageSrc(current);

  if (remote) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- intentional: arbitrary remote URLs without image config
        <img
          src={current}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full object-cover", className)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={handleError}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={current}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={handleError}
      />
    );
  }

  const useUnoptimized = current.startsWith("data:");

  if (fill) {
    return (
      <Image
        src={current}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized={useUnoptimized}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={current}
      alt={alt}
      width={width ?? 1}
      height={height ?? 1}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={useUnoptimized}
      onError={handleError}
    />
  );
}
