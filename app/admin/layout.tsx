"use client";

import Link from "next/link";
import { usePreferences } from "@/components/preferences-provider";

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
          <span className="ml-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-200">
            Draft
          </span>
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
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </header>
        <div className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
