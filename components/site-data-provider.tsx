"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import type { BlogPost } from "@/data/blog";
import type { Certificate } from "@/data/certificates";
import type { Project } from "@/data/projects";
import { site } from "@/data/site";
import {
  clearPortfolioBlobStore,
  deletePortfolioBlob,
  getPortfolioBlob,
  putPortfolioBlob,
} from "@/lib/portfolio-blob-db";
import {
  subscribeToProjects,
  subscribeToHero,
  subscribeToStats,
  saveProjectToFirestore,
  deleteProjectFromFirestore,
  saveHeroToFirestore,
  saveStatsToFirestore,
  getAllProjectsOnce,
  subscribeToBlogs,
  saveBlogToFirestore,
  deleteBlogFromFirestore,
  getAllBlogsOnce,
  subscribeToAds,
  saveAdToFirestore,
  deleteAdFromFirestore,
  subscribeToMessages,
  saveMessageToFirestore,
  deleteMessageFromFirestore,
} from "@/lib/firebase";
import { RESUME_DOWNLOAD_FILENAME, RESUME_HREF } from "@/lib/resume";
import {
  emptyRecycleBin,
  getDefaultSiteData,
  getMarketingCopyDefaults,
  loadSiteDataFromFirestore,
  loadSiteDataFromStorage,
  mergeSectionTaglines,
  parseSiteDataPayload,
  saveSiteDataToStorage,
  slugify,
  SITE_DATA_LEGACY_KEY,
  SITE_DATA_STORAGE_KEY,
  type AboutCms,
  type ContactMessage,
  type EducationCmsEntry,
  type HeroCms,
  type SectionTaglinesCms,
  type SiteDataPayload,
  type SiteRecycleBin,
  type SkillCms,
  type SocialLinksCms,
  type StatCms,
} from "@/lib/site-data";

const DEFAULT_HERO_IMAGE = "/profile.jpg";
const DEFAULT_ABOUT_IMAGE = site.about.profileImage;

type SiteDataContextValue = {
  data: SiteDataPayload;
  hydrated: boolean;
  projects: Project[];
  blogs: BlogPost[];
  certificates: Certificate[];
  hero: HeroCms;
  stats: StatCms[];
  about: AboutCms;
  skills: SkillCms[];
  education: EducationCmsEntry[];
  messages: ContactMessage[];
  recycleBin: SiteRecycleBin;
  sectionTaglines: SectionTaglinesCms;
  social: SocialLinksCms;
  ads: import("@/lib/site-data").AdEntry[];
  logoUrl: string;
  /** Resolved display URLs (public path or blob URL). */
  resolvedHeroImageSrc: string;
  resolvedAboutImageSrc: string;
  resolvedResumeHref: string;
  resolvedResumeDownloadName: string;
  setProjects: (list: Project[]) => void;
  setBlogs: (list: BlogPost[]) => void;
  setCertificates: (list: Certificate[]) => void;
  upsertProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  upsertBlog: (b: BlogPost) => void;
  deleteBlog: (id: string) => void;
  updateHero: (patch: Partial<HeroCms>) => void;
  setStats: (stats: StatCms[]) => void;
  updateAbout: (patch: Partial<AboutCms>) => void;
  setSkills: (skills: SkillCms[]) => void;
  setEducation: (education: EducationCmsEntry[]) => void;
  updateSocial: (patch: Partial<SocialLinksCms>) => void;
  setAds: (ads: import("@/lib/site-data").AdEntry[]) => void;
  updateAssets: (patch: Partial<import("@/lib/site-data").SiteAssets>) => void;
  setHeroProfileFile: (file: File | null) => Promise<void>;
  setAboutProfileFile: (file: File | null) => Promise<void>;
  setResumeFile: (file: File | null) => Promise<void>;
  addContactMessage: (input: { name: string; email: string; subject: string; body: string }) => void;
  deleteContactMessage: (id: string) => void;
  deleteCertificate: (id: string) => void;
  restoreRecycleProject: (id: string) => void;
  purgeRecycleProject: (id: string) => void;
  restoreRecycleBlog: (id: string) => void;
  purgeRecycleBlog: (id: string) => void;
  restoreRecycleMessage: (id: string) => void;
  purgeRecycleMessage: (id: string) => void;
  restoreRecycleCertificate: (id: string) => void;
  purgeRecycleCertificate: (id: string) => void;
  resetToDefaults: () => Promise<void>;
  updateSectionTaglines: (patch: Partial<SectionTaglinesCms>) => void;
  setLogoUrl: (url: string) => void;
  usingFirestore: boolean;
  /** Restores hero, all section taglines, and About section leads to built-in defaults (does not touch projects, blog, skills, etc.). */
  resetMarketingCopyToDefaults: () => void;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const defaults = useMemo(() => getDefaultSiteData(), []);
  const [data, setData] = useState<SiteDataPayload>(defaults);
  const [hydrated, setHydrated] = useState(false);
  const [resolvedHeroImageSrc, setResolvedHeroImageSrc] = useState<string>(DEFAULT_HERO_IMAGE);
  const [resolvedAboutImageSrc, setResolvedAboutImageSrc] = useState<string>(DEFAULT_ABOUT_IMAGE);
  const [resolvedResumeHref, setResolvedResumeHref] = useState<string>(RESUME_HREF);
  const [resolvedResumeDownloadName, setResolvedResumeDownloadName] = useState<string>(
    RESUME_DOWNLOAD_FILENAME,
  );
  const [usingFirestore, setUsingFirestore] = useState(false);

  const heroBlobRef = useRef<string | null>(null);
  const aboutBlobRef = useRef<string | null>(null);
  const resumeBlobRef = useRef<string | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const replaceData = useCallback((updater: (prev: SiteDataPayload) => SiteDataPayload) => {
    setData((prev) => {
      const normalized: SiteDataPayload = {
        ...prev,
        recycleBin: prev.recycleBin ?? emptyRecycleBin(),
        sectionTaglines: prev.sectionTaglines ?? mergeSectionTaglines(undefined, prev.about),
      };
      const next = updater(normalized);
      saveSiteDataToStorage(next);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let firestoreReady = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    (async () => {
      // Try to load the full siteData document from Firestore if available.
      try {
        const fullSiteData = await loadSiteDataFromFirestore();
        if (!cancelled && fullSiteData) {
          firestoreReady = true;
          setUsingFirestore(true);
          setData(fullSiteData);
          setHydrated(true);
        }
      } catch (error) {
        console.error("[site-data-provider] failed loading full siteData from Firestore", error);
      }

      // Try to subscribe to Firestore first. If any subscription emits, we treat Firestore as primary.
      try {
        const unsubProjects = subscribeToProjects((projectsArr) => {
          if (cancelled) return;
          firestoreReady = true;
          setUsingFirestore(true);
          replaceData((prev) => ({ ...prev, projects: projectsArr }));
          setHydrated(true);
        });

        const unsubBlogs = subscribeToBlogs((blogsArr) => {
          if (cancelled) return;
          firestoreReady = true;
          setUsingFirestore(true);
          replaceData((prev) => ({ ...prev, blogs: blogsArr }));
          setHydrated(true);
        });

        const unsubHero = subscribeToHero((heroDoc) => {
          if (cancelled) return;
          if (heroDoc) {
            firestoreReady = true;
            setUsingFirestore(true);
            replaceData((prev) => ({ ...prev, hero: { ...prev.hero, ...heroDoc } }));
            setHydrated(true);
          }
        });

        const unsubStats = subscribeToStats((statsArr) => {
          if (cancelled) return;
          firestoreReady = true;
          setUsingFirestore(true);
          replaceData((prev) => ({ ...prev, stats: statsArr }));
          setHydrated(true);
        });

        const unsubAds = subscribeToAds((adsArr) => {
          if (cancelled) return;
          firestoreReady = true;
          setUsingFirestore(true);
          replaceData((prev) => ({ ...prev, ads: adsArr }));
          setHydrated(true);
        });

        const unsubMessages = subscribeToMessages((msgsArr) => {
          if (cancelled) return;
          firestoreReady = true;
          setUsingFirestore(true);
          replaceData((prev) => ({ ...prev, messages: msgsArr }));
          setHydrated(true);
        });

        // If subscriptions don't report quickly, fallback to localStorage so the app stays usable offline.
        fallbackTimer = setTimeout(async () => {
          if (firestoreReady || cancelled) return;
          // Firestore didn't respond quickly — load localStorage as fallback
          try {
            const stored = loadSiteDataFromStorage();
            if (stored) {
              replaceData(() => stored);
            }
          } catch {
            /* ignore */
          }
          setHydrated(true);
        }, 1200);

        return () => {
          cancelled = true;
          if (fallbackTimer) clearTimeout(fallbackTimer);
          try {
            unsubProjects && unsubProjects();
          } catch {}
          try {
            unsubBlogs && unsubBlogs();
          } catch {}
          try {
            unsubHero && unsubHero();
          } catch {}
          try {
            unsubStats && unsubStats();
          } catch {}
          try {
            unsubAds && unsubAds();
          } catch {}
          try {
            unsubMessages && unsubMessages();
          } catch {}
        };
      } catch {
        // Firestore unavailable — fallback to local storage immediately
        try {
          const stored = loadSiteDataFromStorage();
          if (stored) replaceData(() => stored);
        } catch {}
        setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const revoke = (ref: React.MutableRefObject<string | null>) => {
      if (ref.current) {
        URL.revokeObjectURL(ref.current);
        ref.current = null;
      }
    };

    let cancelled = false;

    (async () => {
      revoke(heroBlobRef);
      let heroSrc: string = data.assets.heroImageUrl || DEFAULT_HERO_IMAGE;
      if (data.assets.heroImageKey && !data.assets.heroImageUrl) {
        const blob = await getPortfolioBlob(data.assets.heroImageKey);
        if (!cancelled && blob) {
          heroSrc = URL.createObjectURL(blob);
          heroBlobRef.current = heroSrc;
        }
      }
      if (!cancelled) setResolvedHeroImageSrc(heroSrc);

      revoke(aboutBlobRef);
      let aboutSrc: string = data.assets.aboutImageUrl || DEFAULT_ABOUT_IMAGE;
      if (data.assets.aboutImageKey && !data.assets.aboutImageUrl) {
        const blob = await getPortfolioBlob(data.assets.aboutImageKey);
        if (!cancelled && blob) {
          aboutSrc = URL.createObjectURL(blob);
          aboutBlobRef.current = aboutSrc;
        }
      }
      if (!cancelled) setResolvedAboutImageSrc(aboutSrc);

      revoke(resumeBlobRef);
      let resumeHref: string = data.assets.resumeUrl || RESUME_HREF;
      let resumeName = data.assets.resumeFileName || RESUME_DOWNLOAD_FILENAME;
      if (data.assets.resumeKey && !data.assets.resumeUrl) {
        const blob = await getPortfolioBlob(data.assets.resumeKey);
        if (!cancelled && blob) {
          resumeHref = URL.createObjectURL(blob);
          resumeBlobRef.current = resumeHref;
          resumeName = data.assets.resumeFileName || RESUME_DOWNLOAD_FILENAME;
        }
      }
      if (!cancelled) {
        setResolvedResumeHref(resumeHref);
        setResolvedResumeDownloadName(resumeName);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    hydrated,
    data.assets.heroImageKey,
    data.assets.aboutImageKey,
    data.assets.resumeKey,
    data.assets.resumeFileName,
    data.assets.heroImageUrl,
    data.assets.aboutImageUrl,
    data.assets.resumeUrl,
  ]);

  useEffect(
    () => () => {
      [heroBlobRef, aboutBlobRef, resumeBlobRef].forEach((ref) => {
        if (ref.current) URL.revokeObjectURL(ref.current);
      });
    },
    [],
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== SITE_DATA_STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = parseSiteDataPayload(JSON.parse(e.newValue));
        if (parsed) setData(parsed);
      } catch {
        /* ignore */
      }
    };
    const onCustom = () => {
      const s = loadSiteDataFromStorage();
      if (s) setData(s);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("rh-site-data-changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("rh-site-data-changed", onCustom);
    };
  }, []);

  const setProjects = useCallback((list: Project[]) => {
    replaceData((prev) => ({ ...prev, projects: list }));
  }, [replaceData]);

  const setBlogs = useCallback((list: BlogPost[]) => {
    replaceData((prev) => ({ ...prev, blogs: list }));
  }, [replaceData]);

  const setCertificates = useCallback((list: Certificate[]) => {
    replaceData((prev) => ({ ...prev, certificates: list }));
  }, [replaceData]);

  const setLogoUrl = useCallback((url: string) => {
    replaceData((prev) => ({ ...prev, logoUrl: url }));
  }, [replaceData]);

  const upsertProject = useCallback(
    (p: Project) => {
      replaceData((prev) => {
        const idx = prev.projects.findIndex((x) => x.id === p.id);
        const next =
          idx === -1 ? [...prev.projects, p] : prev.projects.map((x) => (x.id === p.id ? p : x));
        return { ...prev, projects: next };
      });
      // Persist to Firestore collection if available
      try {
        saveProjectToFirestore(p).catch((error) => {
          console.error("[site-data-provider] saveProjectToFirestore failed", error, p);
        });
      } catch (error) {
        console.error("[site-data-provider] saveProjectToFirestore threw", error, p);
      }
    },
    [replaceData],
  );

  const deleteProject = useCallback(
    (id: string) => {
      replaceData((prev) => {
        const item = prev.projects.find((x) => x.id === id);
        if (!item) return prev;
        const deletedAt = new Date().toISOString();
        return {
          ...prev,
          projects: prev.projects.filter((x) => x.id !== id),
          recycleBin: {
            ...prev.recycleBin,
            projects: [{ deletedAt, item }, ...prev.recycleBin.projects],
          },
        };
      });
      try {
        deleteProjectFromFirestore(id).catch((error) => {
          console.error("[site-data-provider] deleteProjectFromFirestore failed", error, id);
        });
      } catch (error) {
        console.error("[site-data-provider] deleteProjectFromFirestore threw", error, id);
      }
    },
    [replaceData],
  );

  const deleteCertificate = useCallback(
    (id: string) => {
      replaceData((prev) => {
        const item = prev.certificates.find((x) => x.id === id);
        if (!item) return prev;
        const deletedAt = new Date().toISOString();
        return {
          ...prev,
          certificates: prev.certificates.filter((x) => x.id !== id),
          recycleBin: {
            ...prev.recycleBin,
            certificates: [{ deletedAt, item }, ...prev.recycleBin.certificates],
          },
        };
      });
    },
    [replaceData],
  );

  const upsertBlog = useCallback(
    (b: BlogPost) => {
      replaceData((prev) => {
        const idx = prev.blogs.findIndex((x) => x.id === b.id);
        const next =
          idx === -1 ? [...prev.blogs, b] : prev.blogs.map((x) => (x.id === b.id ? b : x));
        return { ...prev, blogs: next };
      });
      try {
        saveBlogToFirestore(b).catch((error) => {
          console.error("[site-data-provider] saveBlogToFirestore failed", error, b);
        });
      } catch (error) {
        console.error("[site-data-provider] saveBlogToFirestore threw", error, b);
      }
    },
    [replaceData],
  );

  const deleteBlog = useCallback(
    (id: string) => {
      replaceData((prev) => {
        const item = prev.blogs.find((x) => x.id === id);
        if (!item) return prev;
        const deletedAt = new Date().toISOString();
        return {
          ...prev,
          blogs: prev.blogs.filter((x) => x.id !== id),
          recycleBin: {
            ...prev.recycleBin,
            blogs: [{ deletedAt, item }, ...prev.recycleBin.blogs],
          },
        };
      });
      try {
        deleteBlogFromFirestore(id).catch((error) => {
          console.error("[site-data-provider] deleteBlogFromFirestore failed", error, id);
        });
      } catch (error) {
        console.error("[site-data-provider] deleteBlogFromFirestore threw", error, id);
      }
    },
    [replaceData],
  );

  const updateHero = useCallback(
    (patch: Partial<HeroCms>) => {
      replaceData((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));
      try {
        saveHeroToFirestore(patch as Record<string, any>).catch((error) => {
          console.error("[site-data-provider] saveHeroToFirestore failed", error, patch);
        });
      } catch (error) {
        console.error("[site-data-provider] saveHeroToFirestore threw", error, patch);
      }
    },
    [replaceData],
  );

  const setStats = useCallback(
    (stats: StatCms[]) => {
      replaceData((prev) => ({ ...prev, stats }));
      try {
        saveStatsToFirestore(stats as Record<string, any>[]).catch((error) => {
          console.error("[site-data-provider] saveStatsToFirestore failed", error, stats);
        });
      } catch (error) {
        console.error("[site-data-provider] saveStatsToFirestore threw", error, stats);
      }
    },
    [replaceData],
  );

  const updateAbout = useCallback(
    (patch: Partial<AboutCms>) => {
      replaceData((prev) => {
        const about = { ...prev.about, ...patch };
        let sectionTaglines = prev.sectionTaglines ?? mergeSectionTaglines(undefined, prev.about);
        if (patch.sectionLeadEn !== undefined || patch.sectionLeadBn !== undefined) {
          sectionTaglines = {
            ...sectionTaglines,
            ...(patch.sectionLeadEn !== undefined ? { aboutLeadEn: patch.sectionLeadEn } : {}),
            ...(patch.sectionLeadBn !== undefined ? { aboutLeadBn: patch.sectionLeadBn } : {}),
          };
        }
        return { ...prev, about, sectionTaglines };
      });
    },
    [replaceData],
  );

  const updateSectionTaglines = useCallback(
    (patch: Partial<SectionTaglinesCms>) => {
      replaceData((prev) => {
        const sectionTaglines = { ...prev.sectionTaglines, ...patch };
        const aboutPatch: Partial<AboutCms> = {};
        if (patch.aboutLeadEn !== undefined) aboutPatch.sectionLeadEn = patch.aboutLeadEn;
        if (patch.aboutLeadBn !== undefined) aboutPatch.sectionLeadBn = patch.aboutLeadBn;
        return {
          ...prev,
          sectionTaglines,
          about:
            Object.keys(aboutPatch).length > 0 ? { ...prev.about, ...aboutPatch } : prev.about,
        };
      });
    },
    [replaceData],
  );

  const resetMarketingCopyToDefaults = useCallback(() => {
    const d = getMarketingCopyDefaults();
    replaceData((prev) => ({
      ...prev,
      hero: d.hero,
      sectionTaglines: d.sectionTaglines,
      about: { ...prev.about, ...d.aboutLeads },
    }));
  }, [replaceData]);

  const setSkills = useCallback(
    (skills: SkillCms[]) => {
      replaceData((prev) => ({ ...prev, skills }));
    },
    [replaceData],
  );

  const setEducation = useCallback(
    (education: EducationCmsEntry[]) => {
      replaceData((prev) => ({ ...prev, education }));
    },
    [replaceData],
  );

  const updateSocial = useCallback(
    (patch: Partial<SocialLinksCms>) => {
      replaceData((prev) => ({ ...prev, social: { ...prev.social, ...patch } }));
    },
    [replaceData],
  );

  const setAds = useCallback(
    (ads: import("@/lib/site-data").AdEntry[]) => {
      replaceData((prev) => ({ ...prev, ads }));
      try {
        ads.forEach(ad => {
          saveAdToFirestore(ad).catch((e) => console.error("Failed to save ad", e));
        });
      } catch {}
    },
    [replaceData],
  );

  const updateAssets = useCallback(
    (patch: Partial<import("@/lib/site-data").SiteAssets>) => {
      replaceData((prev) => ({ ...prev, assets: { ...prev.assets, ...patch } }));
    },
    [replaceData],
  );

  const setHeroProfileFile = useCallback(
    async (file: File | null) => {
      const prevKey = dataRef.current.assets.heroImageKey;
      if (!file) {
        if (prevKey) await deletePortfolioBlob(prevKey);
        replaceData((prev) => ({
          ...prev,
          assets: { ...prev.assets, heroImageKey: null },
        }));
        return;
      }
      if (!file.type.startsWith("image/")) return;
      const key = crypto.randomUUID();
      await putPortfolioBlob(key, file);
      if (prevKey) await deletePortfolioBlob(prevKey);
      replaceData((prev) => ({
        ...prev,
        assets: { ...prev.assets, heroImageKey: key },
      }));
    },
    [replaceData],
  );

  const setAboutProfileFile = useCallback(
    async (file: File | null) => {
      const prevKey = dataRef.current.assets.aboutImageKey;
      if (!file) {
        if (prevKey) await deletePortfolioBlob(prevKey);
        replaceData((prev) => ({
          ...prev,
          assets: { ...prev.assets, aboutImageKey: null },
        }));
        return;
      }
      if (!file.type.startsWith("image/")) return;
      const key = crypto.randomUUID();
      await putPortfolioBlob(key, file);
      if (prevKey) await deletePortfolioBlob(prevKey);
      replaceData((prev) => ({
        ...prev,
        assets: { ...prev.assets, aboutImageKey: key },
      }));
    },
    [replaceData],
  );

  const setResumeFile = useCallback(
    async (file: File | null) => {
      const prevKey = dataRef.current.assets.resumeKey;
      if (!file) {
        if (prevKey) await deletePortfolioBlob(prevKey);
        replaceData((prev) => ({
          ...prev,
          assets: {
            ...prev.assets,
            resumeKey: null,
            resumeFileName: null,
          },
        }));
        return;
      }
      const ok =
        file.type === "application/pdf" ||
        file.type === "image/png" ||
        file.type === "image/jpeg";
      if (!ok) return;
      const key = crypto.randomUUID();
      await putPortfolioBlob(key, file);
      if (prevKey) await deletePortfolioBlob(prevKey);
      const resumeFileName = file.name || RESUME_DOWNLOAD_FILENAME;
      replaceData((prev) => ({
        ...prev,
        assets: {
          ...prev.assets,
          resumeKey: key,
          resumeFileName,
        },
      }));
    },
    [replaceData],
  );

  const addContactMessage = useCallback(
    (input: { name: string; email: string; subject: string; body: string }) => {
      const msg: ContactMessage = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        email: input.email.trim(),
        subject: input.subject.trim(),
        body: input.body.trim(),
        createdAt: new Date().toISOString(),
      };
      replaceData((prev) => ({
        ...prev,
        messages: [msg, ...prev.messages],
      }));
      try {
        saveMessageToFirestore(msg).catch((e) => console.error("Failed to save msg", e));
      } catch {}
    },
    [replaceData],
  );

  const deleteContactMessage = useCallback(
    (id: string) => {
      let itemToRecycle: ContactMessage | undefined;
      replaceData((prev) => {
        const item = prev.messages.find((m) => m.id === id);
        if (!item) return prev;
        itemToRecycle = item;
        const deletedAt = new Date().toISOString();
        return {
          ...prev,
          messages: prev.messages.filter((m) => m.id !== id),
          recycleBin: {
            ...prev.recycleBin,
            messages: [{ deletedAt, item }, ...prev.recycleBin.messages],
          },
        };
      });
      if (itemToRecycle) {
        try {
          deleteMessageFromFirestore(id).catch((e) => console.error("Failed to delete msg", e));
        } catch {}
      }
    },
    [replaceData],
  );

  const restoreRecycleProject = useCallback(
    (id: string) => {
      replaceData((prev) => {
        const entry = prev.recycleBin.projects.find((e) => e.item.id === id);
        if (!entry) return prev;
        const rest = prev.recycleBin.projects.filter((e) => e.item.id !== id);
        const exists = prev.projects.some((p) => p.id === id);
        const projects = exists ? prev.projects : [...prev.projects, entry.item];
        return {
          ...prev,
          projects,
          recycleBin: { ...prev.recycleBin, projects: rest },
        };
      });
    },
    [replaceData],
  );

  const purgeRecycleProject = useCallback(
    (id: string) => {
      replaceData((prev) => ({
        ...prev,
        recycleBin: {
          ...prev.recycleBin,
          projects: prev.recycleBin.projects.filter((e) => e.item.id !== id),
        },
      }));
    },
    [replaceData],
  );

  const restoreRecycleBlog = useCallback(
    (id: string) => {
      replaceData((prev) => {
        const entry = prev.recycleBin.blogs.find((e) => e.item.id === id);
        if (!entry) return prev;
        const rest = prev.recycleBin.blogs.filter((e) => e.item.id !== id);
        const exists = prev.blogs.some((b) => b.id === id);
        const blogs = exists ? prev.blogs : [...prev.blogs, entry.item];
        return {
          ...prev,
          blogs,
          recycleBin: { ...prev.recycleBin, blogs: rest },
        };
      });
    },
    [replaceData],
  );

  const purgeRecycleBlog = useCallback(
    (id: string) => {
      replaceData((prev) => ({
        ...prev,
        recycleBin: {
          ...prev.recycleBin,
          blogs: prev.recycleBin.blogs.filter((e) => e.item.id !== id),
        },
      }));
    },
    [replaceData],
  );

  const restoreRecycleMessage = useCallback(
    (id: string) => {
      let itemToRestore: ContactMessage | undefined;
      replaceData((prev) => {
        const entry = prev.recycleBin.messages.find((e) => e.item.id === id);
        if (!entry) return prev;
        itemToRestore = entry.item;
        const rest = prev.recycleBin.messages.filter((e) => e.item.id !== id);
        return {
          ...prev,
          messages: [entry.item, ...prev.messages],
          recycleBin: { ...prev.recycleBin, messages: rest },
        };
      });
      if (itemToRestore) {
        try {
          saveMessageToFirestore(itemToRestore).catch((e) => console.error("Failed to save msg", e));
        } catch {}
      }
    },
    [replaceData],
  );

  const purgeRecycleMessage = useCallback(
    (id: string) => {
      replaceData((prev) => ({
        ...prev,
        recycleBin: {
          ...prev.recycleBin,
          messages: prev.recycleBin.messages.filter((e) => e.item.id !== id),
        },
      }));
    },
    [replaceData],
  );

  const restoreRecycleCertificate = useCallback(
    (id: string) => {
      replaceData((prev) => {
        const entry = prev.recycleBin.certificates.find((e) => e.item.id === id);
        if (!entry) return prev;
        const rest = prev.recycleBin.certificates.filter((e) => e.item.id !== id);
        const exists = prev.certificates.some((c) => c.id === id);
        const certificates = exists ? prev.certificates : [...prev.certificates, entry.item];
        return {
          ...prev,
          certificates,
          recycleBin: { ...prev.recycleBin, certificates: rest },
        };
      });
    },
    [replaceData],
  );

  const purgeRecycleCertificate = useCallback(
    (id: string) => {
      replaceData((prev) => ({
        ...prev,
        recycleBin: {
          ...prev.recycleBin,
          certificates: prev.recycleBin.certificates.filter((e) => e.item.id !== id),
        },
      }));
    },
    [replaceData],
  );

  const resetToDefaults = useCallback(async () => {
    try {
      await clearPortfolioBlobStore();
    } catch {
      /* ignore */
    }
    const d = getDefaultSiteData();
    setData(d);
    try {
      localStorage.removeItem(SITE_DATA_STORAGE_KEY);
      localStorage.removeItem(SITE_DATA_LEGACY_KEY);
    } catch {
      /* ignore */
    }
    setResolvedHeroImageSrc(DEFAULT_HERO_IMAGE);
    setResolvedAboutImageSrc(DEFAULT_ABOUT_IMAGE);
    setResolvedResumeHref(RESUME_HREF);
    setResolvedResumeDownloadName(RESUME_DOWNLOAD_FILENAME);
    window.dispatchEvent(new CustomEvent("rh-site-data-changed"));
  }, []);

  const value = useMemo(
    () => ({
      data,
      hydrated,
      projects: data.projects,
      blogs: data.blogs,
      certificates: data.certificates,
      hero: data.hero,
      stats: data.stats,
      about: data.about,
      skills: data.skills,
      education: data.education,
      messages: data.messages,
      recycleBin: data.recycleBin,
      sectionTaglines: data.sectionTaglines,
      social: data.social,
      ads: data.ads,
      logoUrl: data.logoUrl,
      resolvedHeroImageSrc,
      resolvedAboutImageSrc,
      resolvedResumeHref,
      resolvedResumeDownloadName,
      setProjects,
      setBlogs,
      setCertificates,
      upsertProject,
      deleteProject,
      upsertBlog,
      deleteBlog,
      updateHero,
      setStats,
      updateAbout,
      setSkills,
      setEducation,
      updateSocial,
      setAds,
      updateAssets,
      setHeroProfileFile,
      setAboutProfileFile,
      setResumeFile,
      addContactMessage,
      deleteContactMessage,
      deleteCertificate,
      restoreRecycleProject,
      purgeRecycleProject,
      restoreRecycleBlog,
      purgeRecycleBlog,
      restoreRecycleMessage,
      purgeRecycleMessage,
      restoreRecycleCertificate,
      purgeRecycleCertificate,
      resetToDefaults,
      updateSectionTaglines,
      setLogoUrl,
      resetMarketingCopyToDefaults,
      usingFirestore,
    }),
    [
      data,
      hydrated,
      resolvedHeroImageSrc,
      resolvedAboutImageSrc,
      resolvedResumeHref,
      resolvedResumeDownloadName,
      setProjects,
      setBlogs,
      upsertProject,
      deleteProject,
      upsertBlog,
      deleteBlog,
      updateHero,
      setStats,
      updateAbout,
      setSkills,
      setEducation,
      updateSocial,
      setAds,
      setHeroProfileFile,
      setAboutProfileFile,
      setResumeFile,
      addContactMessage,
      deleteContactMessage,
      restoreRecycleProject,
      purgeRecycleProject,
      restoreRecycleBlog,
      purgeRecycleBlog,
      restoreRecycleMessage,
      purgeRecycleMessage,
      resetToDefaults,
      updateSectionTaglines,
      setCertificates,
      deleteCertificate,
      setLogoUrl,
      resetMarketingCopyToDefaults,
      usingFirestore,
    ],
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}

export { slugify };
