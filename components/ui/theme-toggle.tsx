"use client";

import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";

export function ThemeToggle() {
  const { theme, setTheme } = usePreferences();

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export default ThemeToggle;
