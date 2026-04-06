"use client";

import Link from "next/link";
import { usePreferences } from "@/components/preferences-provider";
import { useSiteData } from "@/components/site-data-provider";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
] as const;

type SocialBrand =
  | "youtube"
  | "discord"
  | "telegram"
  | "whatsapp"
  | "linkedin"
  | "x"
  | "instagram"
  | "facebook"
  | "github";

const brandSurface: Record<SocialBrand, string> = {
  youtube: "border-red-700/30 bg-[#FF0000] text-white shadow-red-900/20 hover:brightness-110",
  discord: "border-[#4752C4]/40 bg-[#5865F2] text-white shadow-indigo-900/20 hover:brightness-110",
  telegram: "border-[#1b8ab8]/40 bg-[#229ED9] text-white shadow-sky-900/20 hover:brightness-110",
  whatsapp: "border-emerald-700/25 bg-[#25D366] text-white shadow-emerald-900/20 hover:brightness-110",
  linkedin: "border-[#004182]/30 bg-[#0A66C2] text-white shadow-blue-900/25 hover:brightness-110",
  x: "border-slate-800 bg-black text-white shadow-black/25 hover:bg-slate-900",
  instagram:
    "border-pink-500/25 bg-gradient-to-br from-[#f09433] via-[#e4405f] to-[#833ab4] text-white shadow-pink-900/15 hover:brightness-105",
  facebook: "border-[#0d5dbf]/30 bg-[#1877F2] text-white shadow-blue-900/20 hover:brightness-110",
  github: "border-slate-800/50 bg-[#24292f] text-white shadow-slate-900/25 hover:bg-[#1c2127]",
};

function SocialButton({
  href,
  label,
  brand,
  children,
}: {
  href: string;
  label: string;
  brand: SocialBrand;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "btn-interactive flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-sm backdrop-blur-sm sm:h-9 sm:w-9",
        brandSurface[brand],
      )}
    >
      {children}
    </a>
  );
}

const iconSm = "h-[0.95rem] w-[0.95rem] sm:h-[1.05rem] sm:w-[1.05rem]";

function YoutubeIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-3.5 w-3.5 sm:h-[0.9rem] sm:w-[0.9rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className={iconSm} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Footer() {
  const { locale } = usePreferences();
  const { resolvedResumeHref, resolvedResumeDownloadName, sectionTaglines, social } = useSiteData();
  const bn = locale === "bn";
  const footerBlurb = bn ? sectionTaglines.footerTaglineBn : sectionTaglines.footerTaglineEn;

  return (
    <footer className="mt-auto border-t border-white/50 bg-white/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold text-white shadow-md shadow-violet-500/25 sm:h-10 sm:w-10 sm:text-sm">
                RH
              </span>
              <span className="text-sm font-semibold text-slate-900 sm:text-base">MD RAKIB HOSSAIN</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{footerBlurb}</p>
          </div>

          <nav aria-label="Footer" className="lg:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">Navigate</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 sm:mt-3 sm:gap-x-5">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-violet-700">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={resolvedResumeHref}
                  download={resolvedResumeDownloadName}
                  className="transition hover:text-violet-700"
                >
                  Resume
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-6 border-t border-white/50 pt-6 sm:mt-8 sm:pt-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
            Connect With Me
          </p>
          <p className="mt-1 text-center text-xs text-slate-500 sm:text-sm">@rakibhossainDev</p>
          <div className="mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:mt-4 sm:gap-2.5 lg:mx-auto">
            <SocialButton href={social.youtube} label="YouTube @rakibhossainDev" brand="youtube">
              <YoutubeIcon />
            </SocialButton>
            <SocialButton href={social.discord} label="Discord @rakibhossainDev" brand="discord">
              <DiscordIcon />
            </SocialButton>
            <SocialButton href={social.telegram} label="Telegram @rakibhossainDev" brand="telegram">
              <TelegramIcon />
            </SocialButton>
            <SocialButton href={social.whatsapp} label="WhatsApp +8801575809072" brand="whatsapp">
              <WhatsappIcon />
            </SocialButton>
            <SocialButton href={social.linkedin} label="LinkedIn @rakibhossainDev" brand="linkedin">
              <LinkedinIcon />
            </SocialButton>
            <SocialButton href={social.x} label="X @rakibhossainDev" brand="x">
              <XIcon />
            </SocialButton>
            <SocialButton href={social.instagram} label="Instagram @rakibhossainDev" brand="instagram">
              <InstagramIcon />
            </SocialButton>
            <SocialButton href={social.facebook} label="Facebook @rakibhossainDev" brand="facebook">
              <FacebookIcon />
            </SocialButton>
            <SocialButton href={social.github} label="GitHub @rakibhossainDev" brand="github">
              <GithubIcon />
            </SocialButton>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 sm:mt-10 sm:text-sm">
          © 2026 MD RAKIB HOSSAIN. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
