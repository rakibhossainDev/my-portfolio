import type { BlogPost } from "@/data/blog";
import { blogPosts } from "@/data/blog";
import type { Certificate } from "@/data/certificates";
import { certificates as staticCertificates, normalizeCertificate } from "@/data/certificates";
import type { EducationEntry } from "@/data/education";
import { education as staticEducation } from "@/data/education";
import type { Project } from "@/data/projects";
import { normalizeProject, projects } from "@/data/projects";
import { skills as staticSkills } from "@/data/skills";
import { site } from "@/data/site";
import { aboutBn, blogSectionBn, contactSectionBn, footerBn, heroBn, homeUiBn } from "@/data/translations";

/** JSON in localStorage (payload version is inside the object). */
export const SITE_DATA_STORAGE_KEY = "rh-site-data-v2";
export const SITE_DATA_LEGACY_KEY = "rh-site-data-v1";

export type HeroCms = {
  badgeEn: string;
  badgeBn: string;
  roleEn: string;
  roleBn: string;
  descriptionEn: string;
  descriptionBn: string;
};

export type StatCms = {
  id: string;
  value: string;
  suffix: string;
  labelEn: string;
  labelBn: string;
};

/** Section intro lines (EN/BN) — About, Projects, Blog, Contact, Footer blurb. */
export type SectionTaglinesCms = {
  aboutLeadEn: string;
  aboutLeadBn: string;
  projectsSubEn: string;
  projectsSubBn: string;
  blogSubEn: string;
  blogSubBn: string;
  contactSubEn: string;
  contactSubBn: string;
  footerTaglineEn: string;
  footerTaglineBn: string;
};

export type AboutCms = {
  sectionLeadEn: string;
  sectionLeadBn: string;
  journeyEn: string;
  journeyBn: string;
  goalTitleEn: string;
  goalTitleBn: string;
  goalEn: string;
  goalBn: string;
  visionTitleEn: string;
  visionTitleBn: string;
  visionEn: string;
  visionBn: string;
  // Personal info
  name: string;
  title: string;
  location: string;
  email: string;
  education: string;
};

export type SocialLinksCms = {
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  discord: string;
  x: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
};

export type SkillCms = {
  id: string;
  name: string;
  nameBn?: string;
  percent: number;
};

export type EducationCmsEntry = EducationEntry & {
  degreeBn?: string;
  institutionBn?: string;
  detailBn?: string;
};

/** Keys point to IndexedDB blobs (`lib/portfolio-blob-db.ts`). Null = use built-in public files. */
export type SiteAssets = {
  heroImageKey: string | null;
  aboutImageKey: string | null;
  resumeKey: string | null;
  resumeFileName: string | null;
  // URL-based assets (no file upload)
  heroImageUrl: string;
  aboutImageUrl: string;
  resumeUrl: string;
};

export type AdEntry = {
  id: string;
  imageUrl: string;
  redirectUrl: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  createdAt: string;
};

/** Soft-deleted items (admin recycle bin). */
export type RecycleBinEntry<T> = {
  deletedAt: string;
  item: T;
};

export type SiteRecycleBin = {
  projects: RecycleBinEntry<Project>[];
  blogs: RecycleBinEntry<BlogPost>[];
  messages: RecycleBinEntry<ContactMessage>[];
  certificates: RecycleBinEntry<Certificate>[];
};

export function emptyRecycleBin(): SiteRecycleBin {
  return { projects: [], blogs: [], messages: [], certificates: [] };
}

export type SiteDataPayload = {
  version: 3;
  hero: HeroCms;
  stats: StatCms[];
  about: AboutCms;
  skills: SkillCms[];
  education: EducationCmsEntry[];
  projects: Project[];
  blogs: BlogPost[];
  certificates: Certificate[];
  assets: SiteAssets;
  messages: ContactMessage[];
  /** Present for all new saves; omitted in older localStorage rows until next save. */
  recycleBin: SiteRecycleBin;
  /** Home section taglines; omitted in older payloads until merged on load. */
  sectionTaglines: SectionTaglinesCms;
  /** Social media links */
  social: SocialLinksCms;
  /** Advertisement entries */
  ads: AdEntry[];
  /** Logo URL for dynamic branding */
  logoUrl: string;
};

type LegacyV1Payload = {
  version: 1;
  projects: Project[];
  blogs: BlogPost[];
};

export function defaultAssets(): SiteAssets {
  return {
    heroImageKey: null,
    aboutImageKey: null,
    resumeKey: null,
    resumeFileName: null,
    heroImageUrl: "",
    aboutImageUrl: "",
    resumeUrl: "",
  };
}

function defaultStats(): StatCms[] {
  return [
    {
      id: "s1",
      value: "2",
      suffix: "+",
      labelEn: "Years Experience",
      labelBn: "বছরের অভিজ্ঞতা",
    },
    {
      id: "s2",
      value: "15",
      suffix: "+",
      labelEn: "Projects Completed",
      labelBn: "সম্পন্ন প্রকল্প",
    },
    {
      id: "s3",
      value: "",
      suffix: "",
      labelEn: "50+ Apps Published on Play Store",
      labelBn: "প্লে স্টোরে ৫০+ অ্যাপ প্রকাশিত",
    },
  ];
}

function defaultHero(): HeroCms {
  return {
    badgeEn: site.hero.badge,
    badgeBn: heroBn.badge,
    roleEn: site.hero.role,
    roleBn: heroBn.role,
    descriptionEn: site.hero.bio,
    descriptionBn: heroBn.bio,
  };
}

function defaultSectionTaglines(): SectionTaglinesCms {
  const a = defaultAbout();
  return {
    aboutLeadEn: a.sectionLeadEn,
    aboutLeadBn: a.sectionLeadBn,
    projectsSubEn:
      "A collection of Flutter mobile apps that showcase my skills and passion for development.",
    projectsSubBn: homeUiBn.featuredSub,
    blogSubEn: "Notes on Flutter, mobile craft, and shipping apps — short reads for builders.",
    blogSubBn: blogSectionBn.sub,
    contactSubEn: site.contact.sub,
    contactSubBn: contactSectionBn.sub,
    footerTaglineEn: "Flutter app developer — building polished iOS & Android experiences.",
    footerTaglineBn: footerBn.tagline,
  };
}

function defaultAbout(): AboutCms {
  const a = site.about;
  return {
    sectionLeadEn: "MD RAKIB HOSSAIN — Flutter app developer. Journey, skills, and background.",
    sectionLeadBn: aboutBn.sectionSubtitle,
    journeyEn: a.journey,
    journeyBn: aboutBn.journey,
    goalTitleEn: a.goalTitle,
    goalTitleBn: aboutBn.goalTitle,
    goalEn: a.goal,
    goalBn: aboutBn.goal,
    visionTitleEn: a.visionTitle,
    visionTitleBn: aboutBn.visionTitle,
    visionEn: a.vision,
    visionBn: aboutBn.vision,
    // Personal info
    name: a.name,
    title: a.title,
    location: a.location,
    email: a.email,
    education: a.credential,
  };
}

function defaultSkills(): SkillCms[] {
  return staticSkills.map((s, i) => ({
    id: `sk-${i}-${s.name.replace(/\s+/g, "-").toLowerCase()}`,
    name: s.name,
    percent: s.percent,
  }));
}

function defaultSocial(): SocialLinksCms {
  return {
    github: site.social.github,
    linkedin: site.social.linkedin,
    facebook: site.social.facebook,
    youtube: site.connect.youtube,
    discord: site.connect.discord,
    x: site.connect.x,
    instagram: site.connect.instagram,
    telegram: site.connect.telegram,
    whatsapp: site.connect.whatsapp,
  };
}

function defaultEducation(): EducationCmsEntry[] {
  return staticEducation.map((e) => ({ ...e }));
}

export function getDefaultSiteData(): SiteDataPayload {
  const about = defaultAbout();
  return {
    version: 3,
    hero: defaultHero(),
    stats: defaultStats(),
    about,
    skills: defaultSkills(),
    education: defaultEducation(),
    projects: structuredClone(projects).map((p) => normalizeProject(p)),
    blogs: structuredClone(blogPosts),
    certificates: structuredClone(staticCertificates),
    assets: defaultAssets(),
    messages: [],
    recycleBin: emptyRecycleBin(),
    sectionTaglines: defaultSectionTaglines(),
    social: defaultSocial(),
    ads: [],
    logoUrl: "",
  };
}

/** Hero + section taglines + about section leads (for “reset marketing copy”). */
export function getMarketingCopyDefaults(): {
  hero: HeroCms;
  sectionTaglines: SectionTaglinesCms;
  aboutLeads: Pick<AboutCms, "sectionLeadEn" | "sectionLeadBn">;
} {
  const about = defaultAbout();
  return {
    hero: defaultHero(),
    sectionTaglines: defaultSectionTaglines(),
    aboutLeads: {
      sectionLeadEn: about.sectionLeadEn,
      sectionLeadBn: about.sectionLeadBn,
    },
  };
}

function isRecycleBinProjectEntry(x: unknown): x is RecycleBinEntry<Project> {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.deletedAt !== "string" || !o.item || typeof o.item !== "object") return false;
  const it = o.item as Record<string, unknown>;
  return typeof it.id === "string";
}

function isRecycleBinBlogEntry(x: unknown): x is RecycleBinEntry<BlogPost> {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.deletedAt !== "string" || !o.item || typeof o.item !== "object") return false;
  const it = o.item as Record<string, unknown>;
  return typeof it.id === "string";
}

function isRecycleBinMessageEntry(x: unknown): x is RecycleBinEntry<ContactMessage> {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.deletedAt !== "string" || !o.item || typeof o.item !== "object") return false;
  const it = o.item as Record<string, unknown>;
  return typeof it.id === "string";
}

function isRecycleBinCertificateEntry(x: unknown): x is RecycleBinEntry<Certificate> {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.deletedAt !== "string" || !o.item || typeof o.item !== "object") return false;
  const it = o.item as Record<string, unknown>;
  return typeof it.id === "string";
}

export function parseRecycleBin(raw: unknown): SiteRecycleBin {
  const empty = emptyRecycleBin();
  if (!raw || typeof raw !== "object") return empty;
  const o = raw as Record<string, unknown>;
  const projects = Array.isArray(o.projects)
    ? o.projects.filter(isRecycleBinProjectEntry).map((e) => ({
        deletedAt: e.deletedAt,
        item: normalizeProject(e.item),
      }))
    : [];
  const blogs = Array.isArray(o.blogs)
    ? o.blogs.filter(isRecycleBinBlogEntry).map((e) => ({ deletedAt: e.deletedAt, item: e.item }))
    : [];
  const messages = Array.isArray(o.messages)
    ? o.messages.filter(isRecycleBinMessageEntry).map((e) => ({ deletedAt: e.deletedAt, item: e.item }))
    : [];
  const certificates = Array.isArray(o.certificates)
    ? o.certificates.filter(isRecycleBinCertificateEntry).map((e) => ({ deletedAt: e.deletedAt, item: e.item }))
    : [];
  return { projects, blogs, messages, certificates };
}

function isStatCms(x: unknown): x is StatCms {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.value === "string" &&
    typeof o.suffix === "string" &&
    typeof o.labelEn === "string" &&
    typeof o.labelBn === "string"
  );
}

function isHeroCms(x: unknown): x is HeroCms {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.badgeEn === "string" &&
    typeof o.badgeBn === "string" &&
    typeof o.roleEn === "string" &&
    typeof o.roleBn === "string" &&
    typeof o.descriptionEn === "string" &&
    typeof o.descriptionBn === "string"
  );
}

function isAboutCms(x: unknown): x is AboutCms {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.sectionLeadEn === "string" &&
    typeof o.sectionLeadBn === "string" &&
    typeof o.journeyEn === "string" &&
    typeof o.journeyBn === "string" &&
    typeof o.goalTitleEn === "string" &&
    typeof o.goalTitleBn === "string" &&
    typeof o.goalEn === "string" &&
    typeof o.goalBn === "string" &&
    typeof o.visionTitleEn === "string" &&
    typeof o.visionTitleBn === "string" &&
    typeof o.visionEn === "string" &&
    typeof o.visionBn === "string"
  );
}

function isSkillCms(x: unknown): x is SkillCms {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.percent === "number" &&
    (o.nameBn === undefined || typeof o.nameBn === "string")
  );
}

function isEducationCmsEntry(x: unknown): x is EducationCmsEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.degree === "string" &&
    typeof o.institution === "string" &&
    typeof o.period === "string" &&
    typeof o.detail === "string"
  );
}

function isSiteAssets(x: unknown): x is SiteAssets {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const k = (v: unknown) => v === null || typeof v === "string";
  return k(o.heroImageKey) && k(o.aboutImageKey) && k(o.resumeKey) && k(o.resumeFileName);
}

function isContactMessage(x: unknown): x is ContactMessage {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.email === "string" &&
    typeof o.subject === "string" &&
    typeof o.body === "string" &&
    typeof o.createdAt === "string"
  );
}

function isSectionTaglines(x: unknown): x is SectionTaglinesCms {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const keys: (keyof SectionTaglinesCms)[] = [
    "aboutLeadEn",
    "aboutLeadBn",
    "projectsSubEn",
    "projectsSubBn",
    "blogSubEn",
    "blogSubBn",
    "contactSubEn",
    "contactSubBn",
    "footerTaglineEn",
    "footerTaglineBn",
  ];
  return keys.every((k) => typeof o[k] === "string");
}

function isSocialLinksCms(x: unknown): x is SocialLinksCms {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const keys: (keyof SocialLinksCms)[] = [
    "github",
    "linkedin",
    "facebook",
    "youtube",
    "discord",
    "x",
    "instagram",
    "telegram",
    "whatsapp",
  ];
  return keys.every((k) => typeof o[k] === "string");
}

function isAdEntry(x: unknown): x is AdEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.imageUrl === "string" &&
    typeof o.redirectUrl === "string"
  );
}

export function mergeSectionTaglines(raw: unknown, about: AboutCms): SectionTaglinesCms {
  const base = defaultSectionTaglines();
  if (!isSectionTaglines(raw)) {
    return {
      ...base,
      aboutLeadEn: about.sectionLeadEn,
      aboutLeadBn: about.sectionLeadBn,
    };
  }
  const t = raw as SectionTaglinesCms;
  return { ...base, ...t };
}

function buildPayloadFromCore(raw: Record<string, unknown>): SiteDataPayload | null {
  if (!isHeroCms(raw.hero)) return null;
  if (!Array.isArray(raw.stats) || raw.stats.length < 1 || !raw.stats.every(isStatCms)) return null;
  if (!isAboutCms(raw.about)) return null;
  if (!Array.isArray(raw.skills) || !raw.skills.every(isSkillCms)) return null;
  if (!Array.isArray(raw.education) || !raw.education.every(isEducationCmsEntry)) return null;
  if (!Array.isArray(raw.projects) || !Array.isArray(raw.blogs)) return null;

  const assets = isSiteAssets(raw.assets) ? raw.assets : defaultAssets();
  const messages = Array.isArray(raw.messages) && raw.messages.every(isContactMessage)
    ? (raw.messages as ContactMessage[])
    : [];
  const about = raw.about as AboutCms;
  const sectionTaglines = mergeSectionTaglines(raw.sectionTaglines, about);
  const ads = Array.isArray(raw.ads) && raw.ads.every(isAdEntry)
    ? (raw.ads as AdEntry[])
    : [];
  const certificates = Array.isArray(raw.certificates)
    ? (raw.certificates as Certificate[]).map((c) => normalizeCertificate(c))
    : structuredClone(staticCertificates);

  return {
    version: 3,
    hero: raw.hero,
    stats: raw.stats as StatCms[],
    about,
    skills: raw.skills as SkillCms[],
    education: raw.education as EducationCmsEntry[],
    projects: (raw.projects as Project[]).map((p) => normalizeProject(p)),
    blogs: raw.blogs as BlogPost[],
    certificates,
    assets,
    messages,
    recycleBin: parseRecycleBin(raw.recycleBin),
    sectionTaglines,
    social: isSocialLinksCms(raw.social) ? raw.social : defaultSocial(),
    ads,
    logoUrl: typeof raw.logoUrl === 'string' ? raw.logoUrl : "",
  };
}

export function parseSiteDataPayload(raw: unknown): SiteDataPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  if (o.version === 3) {
    return buildPayloadFromCore(o);
  }

  if (o.version === 2) {
    const upgraded = {
      ...o,
      version: 3,
      assets: defaultAssets(),
      messages: [] as ContactMessage[],
      recycleBin: emptyRecycleBin(),
      certificates: structuredClone(staticCertificates),
      logoUrl: "",
    };
    return buildPayloadFromCore(upgraded);
  }

  if (o.version === 1 && Array.isArray(o.projects) && Array.isArray(o.blogs)) {
    const base = getDefaultSiteData();
    return {
      ...base,
      projects: o.projects as Project[],
      blogs: o.blogs as BlogPost[],
    };
  }

  return null;
}

export function loadSiteDataFromStorage(): SiteDataPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const rawV2 = localStorage.getItem(SITE_DATA_STORAGE_KEY);
    if (rawV2) {
      const parsed = parseSiteDataPayload(JSON.parse(rawV2));
      if (parsed) return parsed;
    }
    const rawV1 = localStorage.getItem(SITE_DATA_LEGACY_KEY);
    if (rawV1) {
      const parsed = JSON.parse(rawV1) as Partial<LegacyV1Payload>;
      if (parsed.version === 1 && Array.isArray(parsed.projects) && Array.isArray(parsed.blogs)) {
        const base = getDefaultSiteData();
        return { ...base, projects: parsed.projects, blogs: parsed.blogs };
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveSiteDataToStorage(data: SiteDataPayload) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SITE_DATA_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("rh-site-data-changed"));
  } catch {
    /* ignore quota */
  }
}

export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || `post-${Date.now()}`;
}
