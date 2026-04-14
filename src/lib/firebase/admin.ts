import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle newline characters in private keys
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = (admin.apps.length ? admin.firestore() : { collection: () => ({ doc: () => ({ get: async () => ({ exists: false, data: () => ({}) }) }) }) }) as admin.firestore.Firestore;
export const adminAuth = (admin.apps.length ? admin.auth() : { verifySessionCookie: async () => null, createSessionCookie: async () => "", verifyIdToken: async () => null }) as admin.auth.Auth;
export const adminStorage = (admin.apps.length ? admin.storage() : { bucket: () => ({ file: () => ({ getSignedUrl: async () => [] }) }) }) as admin.storage.Storage;
