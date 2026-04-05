"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  startTransition,
  useState,
} from "react";

export type Locale = "en" | "bn";

type PreferencesContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const STORAGE_LOCALE = "rh-locale";

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_LOCALE);
    if (v === "bn" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    startTransition(() => {
      const storedL = readStoredLocale();
      if (storedL) setLocaleState(storedL);
    });
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale === "bn" ? "bn" : "en";
    document.documentElement.classList.toggle("locale-bn", locale === "bn");
    document.body.classList.toggle("locale-bn", locale === "bn");
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_LOCALE, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === "en" ? "bn" : "en";
      try {
        localStorage.setItem(STORAGE_LOCALE, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
