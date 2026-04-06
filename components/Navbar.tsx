"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { usePreferences } from "@/components/preferences-provider";
import { navbarBn } from "@/data/translations";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = usePreferences();

  const navItems = [
    { id: "hero", label: locale === "bn" ? navbarBn.home : "Home" },
    { id: "about", label: locale === "bn" ? navbarBn.about : "About" },
    { id: "projects", label: locale === "bn" ? navbarBn.projects : "Projects" },
    { id: "blog", label: locale === "bn" ? navbarBn.blog : "Blog" },
    { id: "contact", label: locale === "bn" ? navbarBn.contact : "Contact" },
  ] as const;

  function sectionHref(pathname: string | null, id: string) {
    if (id === "hero") return pathname === "/" ? "#hero" : "/#hero";
    return pathname === "/" ? `#${id}` : `/#${id}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 shadow-sm shadow-violet-500/5 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:h-[3.75rem] sm:gap-3 sm:px-6 sm:py-0 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold text-white shadow-md shadow-violet-500/25 sm:h-10 sm:w-10 sm:text-sm">
            RH
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-slate-900 sm:inline lg:text-base">
            MD RAKIB HOSSAIN
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={sectionHref(pathname, item.id)}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/60 hover:text-violet-700 lg:px-4 lg:text-base"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-lg border border-white/60 bg-white/45 p-0.5 shadow-sm backdrop-blur-md"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-bold tracking-wide transition sm:px-2.5 sm:py-1.5 sm:text-xs lg:text-sm",
                locale === "en"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("bn")}
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-bold tracking-wide transition sm:px-2.5 sm:py-1.5 sm:text-xs lg:text-sm",
                locale === "bn"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              BN
            </button>
          </div>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/60 bg-white/40 text-slate-700 backdrop-blur-md md:hidden",
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-white/50 bg-white/80 px-3 py-3 backdrop-blur-xl md:hidden"
        >
          <nav className="flex max-h-[min(70vh,calc(100dvh-8rem))] flex-col gap-0.5 overflow-y-auto" aria-label="Mobile">
            <div className="mb-2 flex gap-2 px-1">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-semibold",
                  locale === "en" ? "bg-violet-600 text-white" : "bg-white/60 text-slate-700",
                )}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLocale("bn")}
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-semibold",
                  locale === "bn" ? "bg-violet-600 text-white" : "bg-white/60 text-slate-700",
                )}
              >
                বাংলা
              </button>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={sectionHref(pathname, item.id)}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white/70"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
