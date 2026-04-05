"use client";

import { PreferencesProvider } from "@/components/preferences-provider";
import { SiteDataProvider } from "@/components/site-data-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <SiteDataProvider>{children}</SiteDataProvider>
    </PreferencesProvider>
  );
}
