"use client";

import { useSiteData } from "@/components/site-data-provider";
import { useState, useEffect } from "react";

export function DynamicAd() {
  const { ads } = useSiteData();
  const [currentAd, setCurrentAd] = useState<{ imageUrl: string; redirectUrl: string } | null>(null);

  useEffect(() => {
    if (ads.length > 0) {
      // Select a random ad
      const randomIndex = Math.floor(Math.random() * ads.length);
      setCurrentAd(ads[randomIndex]);
    }
  }, [ads]);

  if (!currentAd || !currentAd.imageUrl) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center">
      <a
        href={currentAd.redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
      >
        <img
          src={currentAd.imageUrl}
          alt="Advertisement"
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </a>
    </div>
  );
}