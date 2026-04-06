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
export type Theme = "light" | "dark";

type PreferencesContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const STORAGE_LOCALE = "rh-locale";
const STORAGE_THEME = "rh-theme";

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

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_THEME);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    startTransition(() => {
      const storedL = readStoredLocale();
      if (storedL) setLocaleState(storedL);
      const storedT = readStoredTheme();
      if (storedT) setThemeState(storedT);
    });
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale === "bn" ? "bn" : "en";
    document.documentElement.classList.toggle("locale-bn", locale === "bn");
    document.body.classList.toggle("locale-bn", locale === "bn");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
  }, [locale, theme]);

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

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_THEME, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(STORAGE_THEME, next);
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
      theme,
      setTheme,
      toggleTheme,
    }),
    [locale, setLocale, toggleLocale, theme, setTheme, toggleTheme],
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
