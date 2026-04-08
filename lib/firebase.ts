import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  DocumentData,
  Firestore,
} from "firebase/firestore";
import type { Project } from "@/data/projects";
import type { BlogPost } from "@/data/blog";
import type { StatCms, HeroCms, ContactMessage, AdEntry } from "@/lib/site-data";

// Lightweight helpers for common CRUD/listen operations used by the admin and site provider.
export function saveProjectToFirestore(p: Record<string, any>) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "projects", p.id);
  return setDoc(ref, p, { merge: true });
}

export function deleteProjectFromFirestore(id: string) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "projects", id);
  return deleteDoc(ref);
}

export function saveHeroToFirestore(hero: Record<string, any>) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "hero", "main");
  return setDoc(ref, hero, { merge: true });
}

export function saveStatsToFirestore(stats: Record<string, any>[]) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  // Write each stat as a doc in `stats` collection
  return Promise.all(
    stats.map((s) => setDoc(doc(db, "stats", s.id), s, { merge: true }))
  );
}

export function subscribeToProjects(onChange: (items: Project[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "projects"), orderBy("title"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        id: d.id,
        title: data.title ?? "",
        description: data.description ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        imageSrc: data.imageSrc ?? "/placeholder-project.svg",
        imageAlt: data.imageAlt ?? "",
        liveUrl: data.liveUrl ?? "#",
        codeUrl: data.codeUrl ?? "#",
        shareUrl: data.shareUrl,
        stars: typeof data.stars === "number" && Number.isFinite(data.stars) ? Math.max(0, Math.floor(data.stars)) : 0,
        gallery: Array.isArray(data.gallery) ? data.gallery.filter((u: any) => typeof u === "string" && u.trim()) : [],
        detailMarkdown: typeof data.detailMarkdown === "string" ? data.detailMarkdown : "",
      } as Project;
    });
    onChange(arr);
  });
  return unsub;
}

export function subscribeToHero(onChange: (docData: HeroCms | null) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const ref = doc(db, "hero", "main");
  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return onChange(null);
    const d = snap.data() as DocumentData;
    const mapped: HeroCms = {
      badgeEn: d.badgeEn ?? "",
      badgeBn: d.badgeBn ?? "",
      roleEn: d.roleEn ?? "",
      roleBn: d.roleBn ?? "",
      descriptionEn: d.descriptionEn ?? "",
      descriptionBn: d.descriptionBn ?? "",
    };
    onChange(mapped);
  });
  return unsub;
}

export function subscribeToStats(onChange: (items: StatCms[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "stats"), orderBy("id"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        id: d.id,
        value: data.value ?? "",
        suffix: data.suffix ?? "",
        labelEn: data.labelEn ?? "",
        labelBn: data.labelBn ?? "",
      } as StatCms;
    });
    onChange(arr);
  });
  return unsub;
}

export async function getAllProjectsOnce(): Promise<Project[]> {
  const app = initFirebase();
  if (!app) return [];
  const db = getFirestore(app);
  const q = query(collection(db, "projects"), orderBy("title"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as DocumentData;
    return {
      id: d.id,
      title: data.title ?? "",
      description: data.description ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      imageSrc: data.imageSrc ?? "/placeholder-project.svg",
      imageAlt: data.imageAlt ?? "",
      liveUrl: data.liveUrl ?? "#",
      codeUrl: data.codeUrl ?? "#",
      shareUrl: data.shareUrl,
      stars: typeof data.stars === "number" && Number.isFinite(data.stars) ? Math.max(0, Math.floor(data.stars)) : 0,
      gallery: Array.isArray(data.gallery) ? data.gallery.filter((u: any) => typeof u === "string" && u.trim()) : [],
      detailMarkdown: typeof data.detailMarkdown === "string" ? data.detailMarkdown : "",
    } as Project;
  });
}

export async function getAllBlogsOnce(): Promise<BlogPost[]> {
  const app = initFirebase();
  if (!app) return [];
  const db = getFirestore(app);
  const q = query(collection(db, "blogs"), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as DocumentData;
    return {
      id: d.id,
      slug: data.slug ?? "",
      title: data.title ?? "",
      titleBn: data.titleBn,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      excerptBn: data.excerptBn,
      imageSrc: data.imageSrc ?? "/placeholder-blog.svg",
      imageAlt: data.imageAlt ?? "",
      content: Array.isArray(data.content) ? data.content : [],
      category: data.category,
      categoryBn: data.categoryBn,
      shortLink: data.shortLink,
    } as BlogPost;
  });
}

export function saveBlogToFirestore(b: Record<string, any>) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "blogs", b.id);
  return setDoc(ref, b, { merge: true });
}

export function deleteBlogFromFirestore(id: string) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "blogs", id);
  return deleteDoc(ref);
}

export function subscribeToBlogs(onChange: (items: BlogPost[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "blogs"), orderBy("date", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        id: d.id,
        slug: data.slug ?? "",
        title: data.title ?? "",
        titleBn: data.titleBn,
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        excerptBn: data.excerptBn,
        imageSrc: data.imageSrc ?? "/placeholder-blog.svg",
        imageAlt: data.imageAlt ?? "",
        content: Array.isArray(data.content) ? data.content : [],
        category: data.category,
        categoryBn: data.categoryBn,
        shortLink: data.shortLink,
      } as BlogPost;
    });
    onChange(arr);
  });
  return unsub;
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

function initFirebase() {
  // Client-side-only init. Environment variables expected to be provided
  // in Vercel as NEXT_PUBLIC_FIREBASE_*
  if (typeof window === "undefined") return null;
  if (_app) return _app;

  try {
    if (getApps().length) {
      _app = getApp();
      return _app;
    }
  } catch {
    /* ignore */
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  } as Record<string, any>;

  if (!config.apiKey || !config.projectId) return null;

  try {
    _app = initializeApp(config);
    return _app;
  } catch (e) {
    // if already initialized concurrently
    try {
      _app = getApp();
      return _app;
    } catch {
      _app = null;
      return null;
    }
  }
}

export function getFirebaseApp() {
  return initFirebase();
}

export function getFirestoreClient() {
  const app = initFirebase();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch {
    return null;
  }
}

export function getAuthClient() {
  const app = initFirebase();
  if (!app) return null;
  if (_auth) return _auth;
  try {
    _auth = getAuth(app);
    // ensure persistence so user stays signed in across refreshes
    try {
      setPersistence(_auth, browserLocalPersistence).catch(() => {});
    } catch {
      /* ignore */
    }
    return _auth;
  } catch {
    _auth = null;
    return null;
  }
}

// Helper wrappers to avoid race conditions with multiple concurrent sign-in calls.
let pendingSignIn: Promise<any> | null = null;

export function signInWithGooglePopupSafe() {
  if (typeof window === "undefined") return Promise.reject(new Error("Client-only"));
  const auth = getAuthClient();
  if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
  if (pendingSignIn) return pendingSignIn;
  const provider = new GoogleAuthProvider();
  pendingSignIn = signInWithPopup(auth, provider).finally(() => (pendingSignIn = null));
  return pendingSignIn;
}

export function signInWithGoogleRedirectSafe() {
  if (typeof window === "undefined") return Promise.reject(new Error("Client-only"));
  const auth = getAuthClient();
  if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
  const provider = new GoogleAuthProvider();
  // Redirect doesn't return a promise the same way; just call it.
  try {
    signInWithRedirect(auth, provider);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

export function signInWithEmailSafe(email: string, password: string) {
  if (typeof window === "undefined") return Promise.reject(new Error("Client-only"));
  const auth = getAuthClient();
  if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
  if (pendingSignIn) return pendingSignIn;
  pendingSignIn = signInWithEmailAndPassword(auth, email, password).finally(() => (pendingSignIn = null));
  return pendingSignIn;
}

export function signOutSafe() {
  if (typeof window === "undefined") return Promise.reject(new Error("Client-only"));
  const auth = getAuthClient();
  if (!auth) return Promise.resolve();
  return firebaseSignOut(auth).catch(() => {});
}

export function isFirebaseConfigAvailable() {
  return !!(typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
}

// Ads operations
export function saveAdToFirestore(ad: Record<string, any>) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "ads", ad.id);
  return setDoc(ref, ad, { merge: true });
}

export function deleteAdFromFirestore(id: string) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "ads", id);
  return deleteDoc(ref);
}

export function subscribeToAds(onChange: (items: AdEntry[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "ads"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        id: d.id,
        imageUrl: data.imageUrl ?? "",
        redirectUrl: data.redirectUrl ?? "",
        isActive: typeof data.isActive === "boolean" ? data.isActive : true,
      } as AdEntry;
    });
    onChange(arr);
  });
  return unsub;
}

// Messages operations
export function saveMessageToFirestore(msg: Record<string, any>) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "messages", msg.id);
  return setDoc(ref, msg, { merge: true });
}

export function deleteMessageFromFirestore(id: string) {
  const app = initFirebase();
  if (!app) return Promise.reject(new Error("Firebase not initialized"));
  const db = getFirestore(app);
  const ref = doc(db, "messages", id);
  return deleteDoc(ref);
}

export function subscribeToMessages(onChange: (items: ContactMessage[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        id: d.id,
        name: data.name ?? "",
        email: data.email ?? "",
        subject: data.subject ?? "",
        body: data.message ?? data.body ?? "",
        createdAt: data.createdAt ?? new Date().toISOString(),
      } as ContactMessage;
    });
    onChange(arr);
  });
  return unsub;
}

