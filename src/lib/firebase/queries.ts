import { adminDb } from "./admin";
import { Store, Product } from "@/types";

/**
 * Fetch a store securely by its slug using the Firebase Admin SDK.
 * Used exclusively on the server (Server Components or API Routes).
 */
export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const storesSnapshot = await adminDb
    .collection("stores")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (storesSnapshot.empty) {
    return null;
  }

  const doc = storesSnapshot.docs[0];
  const data = doc.data();
  
  return {
    ...data,
    id: doc.id,
  } as Store;
}

/**
 * Fetch a store securely by its ID
 */
export async function getStoreById(storeId: string): Promise<Store | null> {
  const docSnap = await adminDb.collection("stores").doc(storeId).get();
  
  if (!docSnap.exists) {
    return null;
  }
  
  return {
    ...docSnap.data(),
    id: docSnap.id,
  } as Store;
}

/**
 * Fetch all products associated with a specific store ID.
 */
export async function getProductsByStoreId(storeId: string): Promise<Product[]> {
  const productsSnapshot = await adminDb
    .collection("products")
    .where("store_id", "==", storeId)
    .get();

  if (productsSnapshot.empty) {
    return [];
  }

  return productsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
    } as Product;
  });
}

/**
 * Fetch a specific product by its ID.
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const docSnap = await adminDb.collection("products").doc(productId).get();
  
  if (!docSnap.exists) {
    return null;
  }
  
  return {
    ...docSnap.data(),
    id: docSnap.id,
  } as Product;
}
