"use client";

import { useEffect, useState } from "react";
import { ENGAGEMENT_CHANGED_EVENT } from "@/lib/engagement-storage";

/** Bump version when localStorage engagement keys change (same tab or custom event). */
export function useEngagementSync(): number {
  const [v, setV] = useState(0);

  useEffect(() => {
    const bump = () => setV((x) => x + 1);
    window.addEventListener(ENGAGEMENT_CHANGED_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(ENGAGEMENT_CHANGED_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  return v;
}
