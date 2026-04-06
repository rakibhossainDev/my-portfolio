"use client";

import { useParams } from "next/navigation";
import { useSiteData } from "@/components/site-data-provider";
import { SafeImage } from "@/components/SafeImage";
import { GlassCard } from "@/components/cards/GlassCard";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CertificatePage() {
  const params = useParams();
  const { certificates } = useSiteData();
  const certificateId = params.id as string;

  const certificate = certificates.find((cert) => cert.id === certificateId);

  if (!certificate) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Certificate not found</h1>
        <p className="mt-2 text-slate-600">The certificate you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Portfolio
        </Link>
      </div>

      {/* Certificate Display */}
      <GlassCard className="overflow-hidden p-0">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <SafeImage
              src={certificate.fullImageSrc || certificate.imageSrc}
              alt={certificate.imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          </div>
        </div>

        {/* Certificate Info */}
        <div className="p-6 sm:p-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {certificate.title}
            </h1>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-violet-600">
                  {certificate.organization}
                </p>
                <p className="text-sm text-slate-600">
                  Issued on {new Date(certificate.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {certificate.verificationUrl && (
                <a
                  href={certificate.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Verify Certificate
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Share Section */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-lg font-semibold text-slate-900">Share this achievement</h2>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: certificate.title,
                        text: `Check out my ${certificate.title} certificate from ${certificate.organization}`,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}