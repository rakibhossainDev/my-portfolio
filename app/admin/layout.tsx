import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-950 md:flex-row">
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
        </header>
        <div className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
