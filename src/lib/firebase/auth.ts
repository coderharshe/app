import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  getIdToken,
  User
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { createSession, removeSession } from "@/app/actions/auth-actions";

/**
 * 1. Sign up flow
 * Signs up a new user and establishes a secure Next.js session.
 */
export async function signUpUser(email: string, password: string): Promise<User> {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const token = await getIdToken(userCred.user);
  await createSession(token);
  return userCred.user;
}

/**
 * 2. Onboarding flow
 * Provisions a store for an authenticated user and generates a slug.
 */
export async function createTenantStore(userId: string, storeName: string) {
  const storeId = crypto.randomUUID();
  // Generate basic unique slug (could be scaled to check if exists later)
  const slug = storeName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 10000);
  
  const storeRef = doc(db, "stores", storeId);
  await setDoc(storeRef, {
    id: storeId,
    name: storeName,
    slug,
    owner_id: userId,
    createdAt: new Date().toISOString(),
  });

  return storeId;
}

/**
 * Logs in returning user and establishes session.
 */
export async function logInUser(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const token = await getIdToken(userCred.user);
  await createSession(token);
}

/**
 * Logs out user and destroys session.
 */
export async function logOutUser() {
  await signOut(auth);
  await removeSession();
}
