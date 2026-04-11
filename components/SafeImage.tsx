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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(normalizeImageSrc(src));
    setLoaded(false); // Reset loaded state when src changes
  }, [src]);

  const handleError = useCallback(() => {
    setCurrent((prev) => {
      if (prev === INLINE_IMAGE_FALLBACK) return prev;
      if (prev === FILE_FALLBACK) return INLINE_IMAGE_FALLBACK;
      return FILE_FALLBACK;
    });
    setLoaded(true); // Treat error as 'loaded' so fallback shows
  }, []);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const remote = isRemoteImageSrc(current);
  
  const containerClasses = cn(
    "relative overflow-hidden bg-slate-100/50",
    fill ? "h-full w-full" : ""
  );

  const imageClasses = cn(
    "transition-opacity duration-500 ease-in-out",
    loaded ? "opacity-100" : "opacity-0",
    className
  );

  const placeholder = !loaded && (
    <div className="absolute inset-0 z-10">
      <div className="skeleton h-full w-full" />
    </div>
  );

  if (remote) {
    return (
      <div className={containerClasses}>
        {placeholder}
        {/* eslint-disable-next-line @next/next/no-img-element -- intentional: arbitrary remote URLs without image config */}
        <img
          src={current}
          alt={alt}
          className={cn(
            fill ? "absolute inset-0 h-full w-full object-cover" : "",
            imageClasses
          )}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>
    );
  }

  const useUnoptimized = current.startsWith("data:");

  return (
    <div className={containerClasses}>
      {placeholder}
      <Image
        src={current}
        alt={alt}
        fill={fill}
        width={!fill ? (width ?? 1) : undefined}
        height={!fill ? (height ?? 1) : undefined}
        className={imageClasses}
        sizes={sizes}
        priority={priority}
        unoptimized={useUnoptimized}
        onError={handleError}
        onLoadingComplete={handleLoad}
      />
    </div>
  );
}
