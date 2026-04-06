"use client";

import { useCallback, useEffect, startTransition, useState } from "react";
import type { BlogPost } from "@/data/blog";
import type { Certificate } from "@/data/certificates";
import type { Project } from "@/data/projects";
import {
  ADMIN_PASS,
  ADMIN_USER,
  clearAdminSession,
  isAdminSession,
  setAdminSession,
} from "@/lib/admin-auth";
import type { EducationCmsEntry, SkillCms } from "@/lib/site-data";
import { slugify, useSiteData } from "@/components/site-data-provider";

type Tab =
  | "hero"
  | "stats"
  | "taglines"
  | "about"
  | "social"
  | "projects"
  | "blogs"
  | "certificates"
  | "media"
  | "ads"
  | "general"
  | "inbox"
  | "recycle";

function parseTags(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseContentBlocks(s: string): string[] {
  return s
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Generate a clean short link for sharing */
function generateShortLink(slug: string): string {
  if (!slug) return "";
  return `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${slug}`;
}

const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  tags: [],
  imageSrc: "/placeholder-project.svg",
  imageAlt: "",
  liveUrl: "#",
  codeUrl: "#",
  shareUrl: "#",
  stars: 0,
  gallery: [],
  detailMarkdown: "",
});

const emptyBlog = (): BlogPost => ({
  id: crypto.randomUUID(),
  slug: "",
  title: "",
  titleBn: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  excerptBn: "",
  imageSrc: "/placeholder-blog.svg",
  imageAlt: "",
  content: [""],
  category: "",
  categoryBn: "",
  shortLink: "",
});

const emptySkill = (): SkillCms => ({
  id: crypto.randomUUID(),
  name: "",
  nameBn: "",
  percent: 85,
});

const emptyEducation = (): EducationCmsEntry => ({
  id: crypto.randomUUID(),
  degree: "",
  institution: "",
  period: "",
  detail: "",
  degreeBn: "",
  institutionBn: "",
  detailBn: "",
});

const emptyCertificate = (): Certificate => ({
  id: crypto.randomUUID(),
  title: "",
  titleBn: "",
  organization: "",
  organizationBn: "",
  date: new Date().toISOString().slice(0, 10),
  imageSrc: "/placeholder-certificate.svg",
  imageAlt: "",
  fullImageSrc: "",
  verificationUrl: "",
});

const inputClass =
  "mt-1 w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none ring-zinc-600 focus:ring-2";

const labelClass = "block text-xs font-medium uppercase tracking-wide text-zinc-500";

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("hero");

  const {
    data,
    hydrated,
    projects,
    blogs,
    certificates,
    hero,
    stats,
    about,
    skills,
    education,
    messages,
    upsertProject,
    deleteProject,
    upsertBlog,
    deleteBlog,
    setCertificates,
    resetToDefaults,
    updateHero,
    setStats,
    deleteCertificate,
    updateAbout,
    setSkills,
    setEducation,
    setHeroProfileFile,
    setAboutProfileFile,
    setResumeFile,
    deleteContactMessage,
    recycleBin,
    restoreRecycleProject,
    purgeRecycleProject,
    restoreRecycleBlog,
    purgeRecycleBlog,
    restoreRecycleMessage,
    purgeRecycleMessage,
    restoreRecycleCertificate,
    purgeRecycleCertificate,
    sectionTaglines,
    updateSectionTaglines,
    resetMarketingCopyToDefaults,
    social,
    updateSocial,
    ads,
    setAds,
    setLogoUrl,
    updateAssets,
  } = useSiteData();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [projectTagsStr, setProjectTagsStr] = useState("");
  const [projectGalleryStr, setProjectGalleryStr] = useState("");
  const [blogContentStr, setBlogContentStr] = useState("");
  const [editingSkill, setEditingSkill] = useState<SkillCms | null>(null);
  const [editingEdu, setEditingEdu] = useState<EducationCmsEntry | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  useEffect(() => {
    startTransition(() => {
      setAuthed(isAdminSession());
      setReady(true);
    });
  }, []);

  const login = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        setAdminSession();
        setAuthed(true);
        setPass("");
      } else {
        setLoginError("Invalid username or password.");
      }
    },
    [user, pass],
  );

  const logout = useCallback(() => {
    clearAdminSession();
    setAuthed(false);
    setUser("");
    setPass("");
  }, []);

  const openNewProject = () => {
    const p = emptyProject();
    setEditingProject(p);
    setProjectTagsStr("");
    setProjectGalleryStr("");
  };

  const openEditProject = (p: Project) => {
    setEditingProject({ ...p });
    setProjectTagsStr(p.tags.join(", "));
    setProjectGalleryStr((p.gallery ?? []).join("\n"));
  };

  const saveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    const gallery = projectGalleryStr
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const starsRaw = Number(editingProject.stars);
    const stars = Number.isFinite(starsRaw) ? Math.max(0, Math.floor(starsRaw)) : 0;
    const p: Project = {
      ...editingProject,
      tags: parseTags(projectTagsStr),
      imageAlt: editingProject.imageAlt || editingProject.title || "Project",
      stars,
      gallery,
      detailMarkdown: editingProject.detailMarkdown ?? "",
    };
    upsertProject(p);
    setEditingProject(null);
  };

  const openNewBlog = () => {
    const b = emptyBlog();
    setEditingBlog(b);
    setBlogContentStr("");
  };

  const openEditBlog = (b: BlogPost) => {
    setEditingBlog({ ...b });
    setBlogContentStr(b.content.join("\n\n"));
  };

  const saveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    const blocks = parseContentBlocks(blogContentStr);
    const slug =
      editingBlog.slug.trim() || slugify(editingBlog.title) || `post-${editingBlog.id.slice(0, 8)}`;
    const shortLink = editingBlog.shortLink || generateShortLink(slug);
    const b: BlogPost = {
      ...editingBlog,
      slug,
      content: blocks.length ? blocks : ["Add your article body in the admin panel."],
      imageAlt: editingBlog.imageAlt || editingBlog.title,
      titleBn: editingBlog.titleBn?.trim() || editingBlog.title,
      excerptBn: editingBlog.excerptBn?.trim() || editingBlog.excerpt,
      category: editingBlog.category?.trim() || "",
      categoryBn: editingBlog.categoryBn?.trim() || "",
      shortLink,
    };
    upsertBlog(b);
    setEditingBlog(null);
  };

  const saveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    const idx = skills.findIndex((s) => s.id === editingSkill.id);
    const next =
      idx === -1 ? [...skills, editingSkill] : skills.map((s) => (s.id === editingSkill.id ? editingSkill : s));
    setSkills(next);
    setEditingSkill(null);
  };

  const saveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    const idx = education.findIndex((x) => x.id === editingEdu.id);
    const next =
      idx === -1 ? [...education, editingEdu] : education.map((x) => (x.id === editingEdu.id ? editingEdu : x));
    setEducation(next);
    setEditingEdu(null);
  };

  const openNewCert = () => {
    const c = emptyCertificate();
    setEditingCert(c);
  };

  const openEditCert = (c: Certificate) => {
    setEditingCert({ ...c });
  };

  const saveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    // Validation: title and organization required
    if (!editingCert.title.trim() || !editingCert.organization.trim()) {
      alert("Please provide a certificate title and organization.");
      return;
    }
    const idx = data.certificates.findIndex((x) => x.id === editingCert.id);
    const next = idx === -1 ? [...data.certificates, editingCert] : data.certificates.map((x) => (x.id === editingCert.id ? editingCert : x));
    setCertificates(next);
    setEditingCert(null);
  };

  const tabBtn = (id: Tab, label: string) => (
    <button
      type="button"
      key={id}
      onClick={() => setTab(id)}
      className={`shrink-0 rounded-lg px-3 py-2.5 text-xs font-medium sm:px-4 sm:text-sm ${
        tab === id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );

  if (!ready || !hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="p-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Admin Access</h1>
                <p className="mt-2 text-sm text-zinc-400">Sign in to manage your portfolio content</p>
              </div>

              <form onSubmit={login} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300" htmlFor="adm-user">
                    Username
                  </label>
                  <input
                    id="adm-user"
                    autoComplete="username"
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-3 text-sm text-white placeholder-zinc-500 outline-none ring-zinc-600 focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter your username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300" htmlFor="adm-pass">
                    Password
                  </label>
                  <input
                    id="adm-pass"
                    type="password"
                    autoComplete="current-password"
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-3 text-sm text-white placeholder-zinc-500 outline-none ring-zinc-600 focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter your password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
                {loginError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-sm text-red-400">{loginError}</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg hover:from-violet-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-zinc-500">
                  Content is stored locally in your browser
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        <strong className="font-semibold">Local draft.</strong> JSON lives in{" "}
        <code className="rounded bg-black/30 px-1 font-mono text-xs">localStorage</code>; uploaded images and
        resume use <code className="rounded bg-black/30 px-1 font-mono text-xs">IndexedDB</code>. Add server
        auth before production.
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Hero, stats, about, skills, education, projects, and blog — all in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Reset hero text, all home section taglines, and About intro lines to built-in defaults? Projects, blog, skills, and media are not changed.",
                )
              ) {
                resetMarketingCopyToDefaults();
              }
            }}
            className="rounded-lg border border-sky-500/40 px-3 py-2 text-sm text-sky-200 hover:bg-sky-500/10"
          >
            Reset marketing copy
          </button>
          <button
            type="button"
            onClick={async () => {
              if (
                confirm(
                  "Reset ALL site data (including uploaded images, resume, and inbox) to built-in defaults?",
                )
              ) {
                await resetToDefaults();
              }
            }}
            className="rounded-lg border border-amber-500/40 px-3 py-2 text-sm text-amber-200 hover:bg-amber-500/10"
          >
            Reset data
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-white/10 pb-2 px-1 scrollbar-hide">
        {tabBtn("hero", "Hero")}
        {tabBtn("stats", "Stats")}
        {tabBtn("taglines", "Taglines")}
        {tabBtn("about", "About")}
        {tabBtn("social", "Social")}
        {tabBtn("projects", "Projects")}
        {tabBtn("blogs", "Blog")}
        {tabBtn("certificates", "Certs")}
        {tabBtn("media", "Media")}
        {tabBtn("ads", "Ads")}
        {tabBtn("general", "Settings")}
        {tabBtn("inbox", "Inbox")}
        {tabBtn("recycle", "Recycle")}
      </div>

      {tab === "recycle" && (
        <section className="space-y-8 rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Recycle bin</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Deleted projects, blog posts, and inbox messages stay here until you recover or permanently remove them.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Projects</h3>
            {recycleBin.projects.length === 0 ? (
              <p className="text-sm text-zinc-500">No deleted projects.</p>
            ) : (
              <ul className="space-y-2">
                {recycleBin.projects?.map((e) => (
                  <li
                    key={e.item.id}
                    className="flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{e.item.title || "(untitled)"}</p>
                      <p className="text-xs text-zinc-500">
                        Deleted {new Date(e.deletedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => restoreRecycleProject(e.item.id)}
                        className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10"
                      >
                        Recover
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Permanently delete this project? This cannot be undone."))
                            purgeRecycleProject(e.item.id);
                        }}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
                      >
                        Delete forever
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Certificates</h3>
            {recycleBin.certificates.length === 0 ? (
              <p className="text-sm text-zinc-500">No deleted certificates.</p>
            ) : (
              <ul className="space-y-2">
                {recycleBin.certificates?.map((e) => (
                  <li
                    key={e.item.id}
                    className="flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{e.item.title || "(untitled)"}</p>
                      <p className="text-xs text-zinc-500">Deleted {new Date(e.deletedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => restoreRecycleCertificate(e.item.id)}
                        className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10"
                      >
                        Recover
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Permanently delete this certificate? This cannot be undone."))
                            purgeRecycleCertificate(e.item.id);
                        }}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
                      >
                        Delete forever
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Blog posts</h3>
            {recycleBin.blogs.length === 0 ? (
              <p className="text-sm text-zinc-500">No deleted posts.</p>
            ) : (
              <ul className="space-y-2">
                {recycleBin.blogs?.map((e) => (
                  <li
                    key={e.item.id}
                    className="flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{e.item.title || "(untitled)"}</p>
                      <p className="text-xs text-zinc-500">
                        /blog/{e.item.slug} · deleted {new Date(e.deletedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => restoreRecycleBlog(e.item.id)}
                        className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10"
                      >
                        Recover
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Permanently delete this post? This cannot be undone."))
                            purgeRecycleBlog(e.item.id);
                        }}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
                      >
                        Delete forever
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Inbox messages</h3>
            {recycleBin.messages.length === 0 ? (
              <p className="text-sm text-zinc-500">No deleted messages.</p>
            ) : (
              <ul className="space-y-2">
                {recycleBin.messages?.map((e) => (
                  <li
                    key={e.item.id}
                    className="flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{e.item.name}</p>
                      <p className="truncate text-xs text-zinc-500">{e.item.email}</p>
                      <p className="text-xs text-zinc-500">
                        Deleted {new Date(e.deletedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => restoreRecycleMessage(e.item.id)}
                        className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10"
                      >
                        Recover
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Permanently delete this message? This cannot be undone."))
                            purgeRecycleMessage(e.item.id);
                        }}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
                      >
                        Delete forever
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {tab === "media" && (
        <section className="space-y-6 rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">Images & resume</h2>
          <p className="text-sm text-zinc-400">
            Enter direct URLs for images and resume. These will be used instead of uploaded files.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
              <h3 className="text-sm font-semibold text-white">Hero profile image URL</h3>
              <p className="mt-1 text-xs text-zinc-500">Direct link to profile image</p>
              <input
                type="url"
                placeholder="https://example.com/profile.jpg"
                className={inputClass}
                value={data.assets.heroImageUrl || ""}
                onChange={(e) => {
                  updateAssets({ heroImageUrl: e.target.value });
                }}
              />
              <p className="mt-2 text-xs text-zinc-600">
                Current: {data.assets.heroImageUrl || "none (default)"}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
              <h3 className="text-sm font-semibold text-white">About Me image URL</h3>
              <p className="mt-1 text-xs text-zinc-500">Direct link to about section image</p>
              <input
                type="url"
                placeholder="https://example.com/about.jpg"
                className={inputClass}
                value={data.assets.aboutImageUrl || ""}
                onChange={(e) => {
                  updateAssets({ aboutImageUrl: e.target.value });
                }}
              />
              <p className="mt-2 text-xs text-zinc-600">
                Current: {data.assets.aboutImageUrl || "none (default)"}
              </p>
            </div>
            <div className="md:col-span-2 rounded-lg border border-white/10 bg-zinc-950/50 p-4">
              <h3 className="text-sm font-semibold text-white">Resume URL</h3>
              <p className="mt-1 text-xs text-zinc-500">Direct link to resume PDF or image</p>
              <input
                type="url"
                placeholder="https://example.com/resume.pdf"
                className={inputClass}
                value={data.assets.resumeUrl || ""}
                onChange={(e) => {
                  updateAssets({ resumeUrl: e.target.value });
                }}
              />
              <p className="mt-2 text-xs text-zinc-600">
                Current: {data.assets.resumeUrl || "none (default)"}
              </p>
            </div>
          </div>
        </section>
      )}

      {tab === "ads" && (
        <section className="space-y-6 rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">Ad Management</h2>
          <p className="text-sm text-zinc-400">
            Manage advertisement banners. One random ad will be displayed horizontally at the bottom of each newsletter page.
          </p>

          <div className="space-y-4">
            {data.ads?.map((ad, index) => (
              <div key={ad.id} className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className={labelClass}>Ad Image URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/ad-banner.jpg"
                        className={inputClass}
                        value={ad.imageUrl}
                        onChange={(e) => {
                          const newAds = [...data.ads];
                          newAds[index].imageUrl = e.target.value;
                          setAds(newAds);
                        }}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Ad Redirect URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/landing-page"
                        className={inputClass}
                        value={ad.redirectUrl}
                        onChange={(e) => {
                          const newAds = [...data.ads];
                          newAds[index].redirectUrl = e.target.value;
                          setAds(newAds);
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newAds = data.ads.filter((_, i) => i !== index);
                      setAds(newAds);
                    }}
                    className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newAd = {
                  id: crypto.randomUUID(),
                  imageUrl: "",
                  redirectUrl: "",
                };
                setAds([...data.ads, newAd]);
              }}
              className="w-full rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-400 hover:bg-violet-500/20"
            >
              + Add New Ad
            </button>
          </div>
        </section>
      )}

      {tab === "certificates" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">Certificates</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={openNewCert}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Add certificate
              </button>
              <button
                type="button"
                onClick={() => {
                  setCertificates([]);
                }}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
              >
                Clear all
              </button>
            </div>
          </div>

          {editingCert ? (
            <form onSubmit={saveCertificate} className="rounded-lg border border-white/10 bg-zinc-950/50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Certificate Name</label>
                  <input
                    className={inputClass}
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    placeholder="e.g. Advanced React Patterns"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Platform / Issuer</label>
                  <input
                    className={inputClass}
                    value={editingCert.organization}
                    onChange={(e) => setEditingCert({ ...editingCert, organization: e.target.value })}
                    placeholder="e.g. Ostad, Udemy, Google"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Photo / Badge URL</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={editingCert.imageSrc}
                    onChange={(e) => setEditingCert({ ...editingCert, imageSrc: e.target.value })}
                    placeholder="https://example.com/cert.jpg"
                  />
                </div>
                <div>
                  <label className={labelClass}>Issue Date</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={editingCert.date}
                    onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                  Save certificate
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <ul className="space-y-2">
              {data.certificates?.map((cert) => (
                <li
                  key={cert.id}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{cert.title || "(untitled)"}</p>
                    <p className="truncate text-xs text-zinc-500">
                      {cert.organization} · {cert.date}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditCert(cert)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Move this certificate to the Recycle Bin?")) deleteCertificate(cert.id);
                      }}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="text-xs text-zinc-400">Full certificate editor available here.</p>
        </section>
      )}

      {tab === "general" && (
        <section className="space-y-6 rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">General Settings</h2>
            <p className="mt-1 text-sm text-zinc-400">Manage your site-wide configuration and settings</p>
          </div>

          <div className="max-w-xl">
            <label className="block text-sm font-medium text-zinc-200">Logo URL</label>
            <p className="mt-1 text-xs text-zinc-400">
              Enter the URL of your logo image. It will be displayed in the navbar and footer.
            </p>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              className={inputClass}
              value={data.logoUrl || ""}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            {data.logoUrl && (
              <div className="mt-3 flex h-12 w-auto items-center gap-3 rounded-lg border border-white/10 bg-zinc-900/50 p-2">
                <img
                  src={data.logoUrl}
                  alt="Logo preview"
                  className="max-h-full max-w-[100px] object-contain"
                />
                <span className="text-xs text-zinc-400">Preview</span>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "inbox" && (
        <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">Contact inbox</h2>
          <p className="text-sm text-zinc-400">
            Messages from the site contact form (this browser only). Newest first.
          </p>
          {messages.length === 0 ? (
            <p className="text-sm text-zinc-500">No messages yet.</p>
          ) : (
            <ul className="space-y-4">
              {messages?.map((m) => {
                const d = new Date(m.createdAt);
                const datePart = d.toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const timePart = d.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                });
                return (
                  <li
                    key={m.id}
                    className="rounded-lg border border-white/10 bg-zinc-950/60 p-4 text-sm text-zinc-200"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white">{m.name}</p>
                        <a href={`mailto:${m.email}`} className="text-violet-400 hover:underline">
                          {m.email}
                        </a>
                      </div>
                      <div className="text-right text-xs text-zinc-500">
                        <p>{datePart}</p>
                        <p className="font-mono text-zinc-400">{timePart}</p>
                      </div>
                    </div>
                    {m.subject ? (
                      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Subject: {m.subject}
                      </p>
                    ) : null}
                    <p className="mt-2 whitespace-pre-wrap text-zinc-300">{m.body}</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Move this message to the Recycle Bin? You can restore it later."))
                          deleteContactMessage(m.id);
                      }}
                      className="mt-3 text-xs font-medium text-amber-300 hover:underline"
                    >
                      Move to bin
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {tab === "hero" && (
        <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">Hero</h2>
          <p className="text-sm text-zinc-400">Badge, title (role line under your name), and description — English and Bengali.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Badge (EN)</label>
              <input
                className={inputClass}
                value={hero.badgeEn}
                onChange={(e) => updateHero({ badgeEn: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Badge (BN)</label>
              <input
                className={inputClass}
                value={hero.badgeBn}
                onChange={(e) => updateHero({ badgeBn: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Title / role (EN)</label>
              <input
                className={inputClass}
                value={hero.roleEn}
                onChange={(e) => updateHero({ roleEn: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Title / role (BN)</label>
              <input
                className={inputClass}
                value={hero.roleBn}
                onChange={(e) => updateHero({ roleBn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description (EN)</label>
              <textarea
                rows={4}
                className={inputClass}
                value={hero.descriptionEn}
                onChange={(e) => updateHero({ descriptionEn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description (BN)</label>
              <textarea
                rows={4}
                className={inputClass}
                value={hero.descriptionBn}
                onChange={(e) => updateHero({ descriptionBn: e.target.value })}
              />
            </div>
          </div>
        </section>
      )}

      {tab === "stats" && (
        <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">Stats</h2>
          <p className="text-sm text-zinc-400">Three headline numbers (e.g. years, projects, Play Store apps).</p>
          <div className="space-y-6">
            {stats?.map((s, i) => (
              <div
                key={s.id}
                className="grid gap-3 rounded-lg border border-white/10 bg-zinc-950/50 p-4 sm:grid-cols-2 lg:grid-cols-5"
              >
                <div>
                  <label className={labelClass}>Value</label>
                  <input
                    className={inputClass}
                    value={s.value}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...s, value: e.target.value };
                      setStats(next);
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Suffix</label>
                  <input
                    className={inputClass}
                    value={s.suffix}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...s, suffix: e.target.value };
                      setStats(next);
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Label (EN)</label>
                  <input
                    className={inputClass}
                    value={s.labelEn}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...s, labelEn: e.target.value };
                      setStats(next);
                    }}
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className={labelClass}>Label (BN)</label>
                  <input
                    className={inputClass}
                    value={s.labelBn}
                    onChange={(e) => {
                      const next = [...stats];
                      next[i] = { ...s, labelBn: e.target.value };
                      setStats(next);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "taglines" && (
        <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">Home section taglines</h2>
          <p className="text-sm text-zinc-400">
            Subtext under About, Featured Projects, Blog, Get in Touch, and the footer name blurb — English and
            Bengali. Saved with the rest of the site in this browser; updates apply on the home page immediately.
            About intro lines here stay in sync with the About tab.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>About Me — lead (EN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.aboutLeadEn}
                onChange={(e) => updateSectionTaglines({ aboutLeadEn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>About Me — lead (BN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.aboutLeadBn}
                onChange={(e) => updateSectionTaglines({ aboutLeadBn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Featured Projects — sub (EN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.projectsSubEn}
                onChange={(e) => updateSectionTaglines({ projectsSubEn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Featured Projects — sub (BN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.projectsSubBn}
                onChange={(e) => updateSectionTaglines({ projectsSubBn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Blog — sub (EN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.blogSubEn}
                onChange={(e) => updateSectionTaglines({ blogSubEn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Blog — sub (BN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.blogSubBn}
                onChange={(e) => updateSectionTaglines({ blogSubBn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Get in Touch — sub (EN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.contactSubEn}
                onChange={(e) => updateSectionTaglines({ contactSubEn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Get in Touch — sub (BN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.contactSubBn}
                onChange={(e) => updateSectionTaglines({ contactSubBn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Footer — name section blurb (EN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.footerTaglineEn}
                onChange={(e) => updateSectionTaglines({ footerTaglineEn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Footer — name section blurb (BN)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={sectionTaglines.footerTaglineBn}
                onChange={(e) => updateSectionTaglines({ footerTaglineBn: e.target.value })}
              />
            </div>
          </div>
        </section>
      )}

      {tab === "about" && (
        <div className="space-y-8">
          <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
            <h2 className="text-lg font-semibold text-white">About section</h2>
            <p className="text-sm text-zinc-400">
              Intro line, journey, goal, and vision (EN + BN). Section intro lines are shared with the{" "}
              <strong className="text-zinc-300">Taglines</strong> tab.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Section intro (EN)</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={about?.sectionLeadEn || ""}
                  onChange={(e) => updateAbout({ sectionLeadEn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Section intro (BN)</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={about?.sectionLeadBn || ""}
                  onChange={(e) => updateAbout({ sectionLeadBn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>About / journey (EN)</label>
                <textarea
                  rows={4}
                  className={inputClass}
                  value={about?.journeyEn || ""}
                  onChange={(e) => updateAbout({ journeyEn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>About / journey (BN)</label>
                <textarea
                  rows={4}
                  className={inputClass}
                  value={about?.journeyBn || ""}
                  onChange={(e) => updateAbout({ journeyBn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Goal title (EN)</label>
                <input
                  className={inputClass}
                  value={about?.goalTitleEn || ""}
                  onChange={(e) => updateAbout({ goalTitleEn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Goal title (BN)</label>
                <input
                  className={inputClass}
                  value={about?.goalTitleBn || ""}
                  onChange={(e) => updateAbout({ goalTitleBn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Goal text (EN)</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={about?.goalEn || ""}
                  onChange={(e) => updateAbout({ goalEn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Goal text (BN)</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={about?.goalBn || ""}
                  onChange={(e) => updateAbout({ goalBn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Vision title (EN)</label>
                <input
                  className={inputClass}
                  value={about?.visionTitleEn || ""}
                  onChange={(e) => updateAbout({ visionTitleEn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Vision title (BN)</label>
                <input
                  className={inputClass}
                  value={about?.visionTitleBn || ""}
                  onChange={(e) => updateAbout({ visionTitleBn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Vision text (EN)</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={about?.visionEn || ""}
                  onChange={(e) => updateAbout({ visionEn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Vision text (BN)</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={about?.visionBn || ""}
                  onChange={(e) => updateAbout({ visionBn: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
            <h2 className="text-lg font-semibold text-white">Personal Information</h2>
            <p className="text-sm text-zinc-400">
              Basic contact and profile information displayed in the About section.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  value={about?.name || ""}
                  onChange={(e) => updateAbout({ name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Professional Title</label>
                <input
                  className={inputClass}
                  value={about?.title || ""}
                  onChange={(e) => updateAbout({ title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Address/Location</label>
                <input
                  className={inputClass}
                  value={about?.location || ""}
                  onChange={(e) => updateAbout({ location: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={about?.email || ""}
                  onChange={(e) => updateAbout({ email: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Education/Credential</label>
                <input
                  className={inputClass}
                  value={about?.education || ""}
                  onChange={(e) => updateAbout({ education: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">Skills</h2>
              <button
                type="button"
                onClick={() => setEditingSkill(emptySkill())}
                className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Add skill
              </button>
            </div>
            <ul className="space-y-2">
              {skills?.map((sk) => (
                <li
                  key={sk.id}
                  className="flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">
                      {sk.name || "(unnamed)"} · {sk.percent}%
                    </p>
                    {sk.nameBn ? <p className="text-xs text-zinc-500">{sk.nameBn}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSkill({ ...sk })}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this skill?")) setSkills(skills.filter((s) => s.id !== sk.id));
                      }}
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">Education</h2>
              <button
                type="button"
                onClick={() => setEditingEdu(emptyEducation())}
                className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Add entry
              </button>
            </div>
            <ul className="space-y-2">
              {education?.map((ed) => (
                <li
                  key={ed.id}
                  className="flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white">{ed.degree || "(degree)"}</p>
                    <p className="truncate text-xs text-zinc-500">
                      {ed.institution} · {ed.period}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingEdu({ ...ed })}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this education entry?"))
                          setEducation(education.filter((x) => x.id !== ed.id));
                      }}
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "social" && (
        <section className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">Social Media Links</h2>
          <p className="text-sm text-zinc-400">
            Update your social media profiles. These links appear in the footer and about section.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>GitHub</label>
              <input
                type="url"
                className={inputClass}
                value={social?.github || ""}
                onChange={(e) => updateSocial({ github: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input
                type="url"
                className={inputClass}
                value={social?.linkedin || ""}
                onChange={(e) => updateSocial({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className={labelClass}>Facebook</label>
              <input
                type="url"
                className={inputClass}
                value={social?.facebook || ""}
                onChange={(e) => updateSocial({ facebook: e.target.value })}
                placeholder="https://facebook.com/username"
              />
            </div>
            <div>
              <label className={labelClass}>YouTube</label>
              <input
                type="url"
                className={inputClass}
                value={social?.youtube || ""}
                onChange={(e) => updateSocial({ youtube: e.target.value })}
                placeholder="https://youtube.com/@username"
              />
            </div>
            <div>
              <label className={labelClass}>Discord</label>
              <input
                type="url"
                className={inputClass}
                value={social?.discord || ""}
                onChange={(e) => updateSocial({ discord: e.target.value })}
                placeholder="https://discord.gg/invite"
              />
            </div>
            <div>
              <label className={labelClass}>X (Twitter)</label>
              <input
                type="url"
                className={inputClass}
                value={social?.x || ""}
                onChange={(e) => updateSocial({ x: e.target.value })}
                placeholder="https://x.com/username"
              />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input
                type="url"
                className={inputClass}
                value={social?.instagram || ""}
                onChange={(e) => updateSocial({ instagram: e.target.value })}
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <label className={labelClass}>Telegram</label>
              <input
                type="url"
                className={inputClass}
                value={social?.telegram || ""}
                onChange={(e) => updateSocial({ telegram: e.target.value })}
                placeholder="https://t.me/username"
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input
                type="url"
                className={inputClass}
                value={social?.whatsapp || ""}
                onChange={(e) => updateSocial({ whatsapp: e.target.value })}
                placeholder="https://wa.me/1234567890"
              />
            </div>
          </div>
        </section>
      )}

      {tab === "projects" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">Projects</h2>
            <button
              type="button"
              onClick={openNewProject}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Add project
            </button>
          </div>
          <ul className="space-y-2">
            {projects?.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{p.title || "(untitled)"}</p>
                  <p className="truncate text-xs text-zinc-500">{p.imageSrc}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEditProject(p)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Move this project to the Recycle Bin?")) deleteProject(p.id);
                    }}
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "blogs" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">Blog posts</h2>
            <button
              type="button"
              onClick={openNewBlog}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Add post
            </button>
          </div>
          <ul className="space-y-2">
            {blogs?.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{b.title || "(untitled)"}</p>
                  <p className="truncate text-xs text-zinc-500">
                    /blog/{b.slug} · {b.date}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEditBlog(b)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Move this post to the Recycle Bin?")) deleteBlog(b.id);
                    }}
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">
              {projects.some((x) => x.id === editingProject.id) ? "Edit project" : "New project"}
            </h3>
            <form onSubmit={saveProject} className="mt-4 space-y-3">
              <div>
                <label className={labelClass}>Photo (URL)</label>
                <input
                  className={inputClass}
                  value={editingProject.imageSrc}
                  onChange={(e) => setEditingProject({ ...editingProject, imageSrc: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  className={inputClass}
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Caption</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Tags (comma-separated)</label>
                <input
                  className={inputClass}
                  value={projectTagsStr}
                  onChange={(e) => setProjectTagsStr(e.target.value)}
                  placeholder="Flutter, Firebase"
                />
              </div>
              <div>
                <label className={labelClass}>Star count (display)</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={editingProject.stars}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      stars: Math.max(0, Math.floor(Number(e.target.value) || 0)),
                    })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Detail gallery (image URLs, one per line)</label>
                <textarea
                  rows={4}
                  className={inputClass}
                  value={projectGalleryStr}
                  onChange={(e) => setProjectGalleryStr(e.target.value)}
                  placeholder="https://…/screen1.png&#10;https://…/screen2.png"
                />
              </div>
              <div>
                <label className={labelClass}>Detailed description (Markdown)</label>
                <textarea
                  rows={10}
                  className={inputClass}
                  value={editingProject.detailMarkdown ?? ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, detailMarkdown: e.target.value })
                  }
                  placeholder="## Overview&#10;&#10;Write the case study in **Markdown** (headings, lists, links)."
                />
              </div>
              <div>
                <label className={labelClass}>Live demo link</label>
                <input
                  className={inputClass}
                  value={editingProject.liveUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Code link</label>
                <input
                  className={inputClass}
                  value={editingProject.codeUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, codeUrl: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Share link</label>
                <input
                  className={inputClass}
                  value={editingProject.shareUrl ?? ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, shareUrl: e.target.value || undefined })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Image alt text (optional)</label>
                <input
                  className={inputClass}
                  value={editingProject.imageAlt}
                  onChange={(e) => setEditingProject({ ...editingProject, imageAlt: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">
              {blogs.some((x) => x.id === editingBlog.id) ? "Edit post" : "New post"}
            </h3>
            <form onSubmit={saveBlog} className="mt-4 space-y-3">
              <div>
                <label className={labelClass}>Photo (URL)</label>
                <input
                  className={inputClass}
                  value={editingBlog.imageSrc}
                  onChange={(e) => setEditingBlog({ ...editingBlog, imageSrc: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={editingBlog.date}
                  onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>URL slug (optional — auto from headline)</label>
                <input
                  className={inputClass}
                  value={editingBlog.slug}
                  onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                  placeholder="my-post-slug"
                />
              </div>
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  className={inputClass}
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Short caption</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Headline (Bengali, optional)</label>
                <input
                  className={inputClass}
                  value={editingBlog.titleBn}
                  onChange={(e) => setEditingBlog({ ...editingBlog, titleBn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Caption (Bengali, optional)</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={editingBlog.excerptBn}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerptBn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Detailed content (paragraphs separated by blank lines)</label>
                <textarea
                  rows={12}
                  className={`${inputClass} font-mono text-xs leading-relaxed`}
                  value={blogContentStr}
                  onChange={(e) => setBlogContentStr(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Image alt (optional)</label>
                <input
                  className={inputClass}
                  value={editingBlog.imageAlt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, imageAlt: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Category (EN)</label>
                <input
                  className={inputClass}
                  value={editingBlog.category || ""}
                  onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                  placeholder="e.g., Tutorial, News, Tips"
                />
              </div>
              <div>
                <label className={labelClass}>Category (Bengali, optional)</label>
                <input
                  className={inputClass}
                  value={editingBlog.categoryBn || ""}
                  onChange={(e) => setEditingBlog({ ...editingBlog, categoryBn: e.target.value })}
                  placeholder="e.g., টিউটোরিয়াল, সংবাদ, টিপস"
                />
              </div>
              <div>
                <label className={labelClass}>Short Link (auto-generated)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={`${inputClass} flex-1`}
                    value={editingBlog.shortLink || generateShortLink(editingBlog.slug || editingBlog.id)}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const link = generateShortLink(editingBlog.slug || editingBlog.id);
                      setEditingBlog({ ...editingBlog, shortLink: link });
                      try {
                        navigator.clipboard.writeText(link);
                        alert("Link copied to clipboard!");
                      } catch {
                        alert("Could not copy to clipboard");
                      }
                    }}
                    className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500 shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">Skill</h3>
            <form onSubmit={saveSkill} className="mt-4 space-y-3">
              <div>
                <label className={labelClass}>Name (EN)</label>
                <input
                  className={inputClass}
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Name (BN, optional)</label>
                <input
                  className={inputClass}
                  value={editingSkill.nameBn ?? ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, nameBn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Percent</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputClass}
                  value={editingSkill.percent}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, percent: Number(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">Education entry</h3>
            <form onSubmit={saveEducation} className="mt-4 space-y-3">
              <div>
                <label className={labelClass}>Degree (EN)</label>
                <input
                  className={inputClass}
                  value={editingEdu.degree}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Degree (BN, optional)</label>
                <input
                  className={inputClass}
                  value={editingEdu.degreeBn ?? ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degreeBn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Institution (EN)</label>
                <input
                  className={inputClass}
                  value={editingEdu.institution}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Institution (BN, optional)</label>
                <input
                  className={inputClass}
                  value={editingEdu.institutionBn ?? ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institutionBn: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Year / period</label>
                <input
                  className={inputClass}
                  value={editingEdu.period}
                  onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                  required
                  placeholder="2019 — 2021"
                />
              </div>
              <div>
                <label className={labelClass}>Detail (EN)</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={editingEdu.detail}
                  onChange={(e) => setEditingEdu({ ...editingEdu, detail: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Detail (BN, optional)</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={editingEdu.detailBn ?? ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, detailBn: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
