"use client";

interface BilingualToggleProps {
  currentLocale: "en" | "bn";
  onToggle: (locale: "en" | "bn") => void;
  className?: string;
}

export function BilingualToggle({
  currentLocale,
  onToggle,
  className = "",
}: BilingualToggleProps) {
  return (
    <div className={`inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 ${className}`}>
      <button
        onClick={() => onToggle("en")}
        className={`rounded px-3 py-1.5 text-sm font-medium transition ${
          currentLocale === "en"
            ? "bg-violet-600 text-white"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        English
      </button>
      <button
        onClick={() => onToggle("bn")}
        className={`rounded px-3 py-1.5 text-sm font-medium transition ${
          currentLocale === "bn"
            ? "bg-violet-600 text-white"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
