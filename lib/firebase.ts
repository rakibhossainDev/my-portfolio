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

export function subscribeToProjects(onChange: (items: DocumentData[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "projects"), orderBy("title"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => ({ ...(d.data() as DocumentData), id: d.id }));
    onChange(arr);
  });
  return unsub;
}

export function subscribeToHero(onChange: (docData: DocumentData | null) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const ref = doc(db, "hero", "main");
  const unsub = onSnapshot(ref, (snap) => {
    onChange(snap.exists() ? (snap.data() as DocumentData) : null);
  });
  return unsub;
}

export function subscribeToStats(onChange: (items: DocumentData[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "stats"), orderBy("id"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => d.data() as DocumentData);
    onChange(arr);
  });
  return unsub;
}

export async function getAllProjectsOnce(): Promise<DocumentData[]> {
  const app = initFirebase();
  if (!app) return [];
  const db = getFirestore(app);
  const q = query(collection(db, "projects"), orderBy("title"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as DocumentData), id: d.id }));
}

export async function getAllBlogsOnce(): Promise<DocumentData[]> {
  const app = initFirebase();
  if (!app) return [];
  const db = getFirestore(app);
  const q = query(collection(db, "blogs"), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as DocumentData), id: d.id }));
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

export function subscribeToBlogs(onChange: (items: DocumentData[]) => void) {
  const app = initFirebase();
  if (!app) return () => {};
  const db = getFirestore(app);
  const q = query(collection(db, "blogs"), orderBy("date", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const arr = snap.docs.map((d) => ({ ...(d.data() as DocumentData), id: d.id }));
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
