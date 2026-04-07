"use client";

import Link from "next/link";
import { usePreferences } from "@/components/preferences-provider";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { theme, toggleTheme } = usePreferences();

  return (
    <div className={`flex min-h-full flex-col bg-zinc-950 md:flex-row ${theme === 'dark' ? 'dark' : ''}`}>
      <aside className="border-b border-white/10 bg-zinc-900/50 md:w-56 md:border-b-0 md:border-r md:shrink-0">
        <div className="flex min-h-14 items-center border-b border-white/10 px-3 py-2 md:h-16 md:px-4">
          <Link href="/admin" className="text-sm font-semibold text-white">
            Admin
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible" aria-label="Admin">
          <Link
            href="/admin"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            Overview
          </Link>
          <span className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-zinc-500">
            Use tabs in Overview
          </span>
          <Link
            href="/"
            className="mt-2 whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-400 hover:border-white/20 hover:text-zinc-200 md:mt-4"
          >
            ← Site
          </Link>
        </nav>
      </aside>
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex min-h-14 items-center justify-between border-b border-white/10 px-3 py-2 md:h-16 md:px-6">
          <p className="text-xs text-zinc-500 sm:text-sm">Management console</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
