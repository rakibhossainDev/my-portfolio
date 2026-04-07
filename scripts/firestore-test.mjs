import fs from 'fs';
import path from 'path';

// load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(.*))\s*$/);
    if (m) {
      const key = m[1];
      const val = m[2] ?? m[3] ?? m[4] ?? '';
      process.env[key] = val;
    }
  }
} else {
  console.error('.env.local not found');
  process.exit(2);
}

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId) {
  console.error('Missing Firebase config in .env.local');
  process.exit(3);
}

const app = initializeApp(config);
const db = getFirestore(app);

(async () => {
  try {
    const id = `test-write-${Date.now()}`;
    const data = {
      id,
      title: 'Test Project from script',
      description: 'This is a programmatic write test',
      imageSrc: 'https://i.ibb.co/album/example.jpg',
      imageAlt: 'Test image',
      tags: ['test'],
      liveUrl: 'https://example.com',
      codeUrl: 'https://github.com',
      stars: 0,
      gallery: [],
      detailMarkdown: 'Details',
    };

    console.log('Writing test project with id', id);
    await setDoc(doc(db, 'projects', id), data, { merge: true });
    console.log('Write complete; reading back...');
    const snap = await getDoc(doc(db, 'projects', id));
    if (snap.exists()) {
      console.log('Read back document:', JSON.stringify(snap.data(), null, 2));
      process.exit(0);
    } else {
      console.error('Document not found after write');
      process.exit(4);
    }
  } catch (e) {
    console.error('Error during Firestore test:', e);
    process.exit(5);
  }
})();
