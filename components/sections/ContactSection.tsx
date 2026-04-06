"use client";

import { useState } from "react";
import { GlassCard } from "@/components/cards/GlassCard";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { site } from "@/data/site";

export function ContactSection() {
  const c = site.contact;
  const { locale } = usePreferences();
  const { addContactMessage, sectionTaglines } = useSiteData();
  const bn = locale === "bn";
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const subject = String(fd.get("subject") ?? "");
    const message = String(fd.get("message") ?? "");
    addContactMessage({ name, email, subject, body: message });
    setSent(true);
    form.reset();
  }

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-white/40 bg-white/20 py-6 backdrop-blur-sm sm:py-8 md:py-9"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">{c.heading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            {bn ? sectionTaglines.contactSubBn : sectionTaglines.contactSubEn}
          </p>
        </header>

        <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          <GlassCard hover={false} className="p-4 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-700">
              Contact info
            </h3>
            <ul className="mt-5 space-y-5">
              <li>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">{c.location}</p>
              </li>
              <li>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                <a
                  href={`mailto:${c.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-medium text-violet-700 hover:underline"
                >
                  {c.email}
                </a>
              </li>
              <li>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="mt-1 inline-block text-sm font-medium text-violet-700 hover:underline"
                >
                  {c.phone}
                </a>
              </li>
            </ul>
          </GlassCard>

          <GlassCard hover={false} className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="name" className="text-xs font-semibold text-slate-600">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 shadow-inner backdrop-blur-md outline-none ring-violet-500/30 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="cemail" className="text-xs font-semibold text-slate-600">
                  Email
                </label>
                <input
                  id="cemail"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 shadow-inner backdrop-blur-md outline-none ring-violet-500/30 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="text-xs font-semibold text-slate-600">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  className="mt-1 w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 shadow-inner backdrop-blur-md outline-none ring-violet-500/30 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2"
                  placeholder="Project / collaboration"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-xs font-semibold text-slate-600">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="mt-1 w-full resize-y rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-slate-900 shadow-inner backdrop-blur-md outline-none ring-violet-500/30 placeholder:text-slate-400 focus:border-violet-400 focus:ring-2"
                  placeholder="Tell me about your idea..."
                />
              </div>
              <button
                type="submit"
                className="btn-interactive w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
              >
                Send Message
              </button>
              {sent && (
                <p className="text-center text-sm text-emerald-700" role="status">
                  Message sent. It appears in Admin → Inbox for this browser.
                </p>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
