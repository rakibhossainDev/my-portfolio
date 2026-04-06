"use client";

interface BlogAdPlaceholderProps {
  className?: string;
}

export function BlogAdPlaceholder({ className = "" }: BlogAdPlaceholderProps) {
  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-r from-violet-600/10 to-blue-600/10 backdrop-blur-sm ${className}`}>
      <div className="aspect-video flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-zinc-400">Advertisement</div>
          <div className="mt-2 text-xs text-zinc-500">
            Your ad here
          </div>
        </div>
      </div>
    </div>
  );
}
