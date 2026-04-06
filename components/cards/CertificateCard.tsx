"use client";

import { useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import type { Certificate } from "@/data/certificates";
import { GlassCard } from "@/components/cards/GlassCard";
import { cn } from "@/lib/utils";

type CertificateCardProps = {
  certificate: Certificate;
  className?: string;
};

function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function LikeIcon({ className, filled = false }: { className?: string; filled?: boolean }) {
  return filled ? (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ) : (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function CertificateCard({ certificate, className }: CertificateCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: certificate.title,
        text: `Check out my ${certificate.title} certificate from ${certificate.organization}`,
        url: window.location.href,
      }).catch(err => console.log("Share cancelled:", err));
    }
  };

  return (
    <GlassCard className={cn("group flex h-full flex-col overflow-hidden p-0", className)}>
      {/* Certificate Image */}
      <div className="relative">
        <Link
          href={`/certificates/${certificate.id}`}
          className="relative block aspect-[4/5] overflow-hidden bg-slate-200/80"
        >
          <SafeImage
            src={certificate.imageSrc}
            alt={certificate.imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20 opacity-0 transition group-hover:opacity-100" />
        </Link>
          
          {/* View Button */}
          <Link
            href={`/certificates/${certificate.id}`}
            className="btn-interactive absolute right-2 top-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/70 bg-white/60 text-slate-700 shadow-sm backdrop-blur-md transition hover:border-white hover:bg-white/80 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
            aria-label="View certificate"
            title="View certificate"
          >
            <ZoomIcon />
          </Link>
        </div>

        {/* Certificate Info */}
        <div className="relative z-10 flex flex-1 flex-col bg-white/30 p-3 sm:p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
            {certificate.title}
          </h3>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            {certificate.organization}
          </p>
          <p className="mt-0.5 text-xs font-medium text-violet-600">
            {new Date(certificate.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </p>

          {/* Interaction Bar */}
          <div className="mt-auto flex items-center justify-start gap-2 border-t border-white/50 pt-2 sm:pt-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="btn-interactive inline-flex items-center gap-1 rounded-lg border border-red-200/50 bg-red-50/40 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50/60 hover:border-red-300"
              title={isLiked ? "Unlike" : "Like"}
            >
              <LikeIcon filled={isLiked} />
              <span className="hidden sm:inline">{isLiked ? "Liked" : "Like"}</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-interactive inline-flex items-center gap-1 rounded-lg border border-violet-200/50 bg-violet-50/40 px-2.5 py-1 text-xs font-medium text-violet-600 transition hover:bg-violet-50/60 hover:border-violet-300"
              title="Share certificate"
            >
              <ShareIcon />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </GlassCard>
  );
}
