import { db, storage } from "./config";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Product } from "@/types";

export async function fetchStoreProducts(storeId: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("store_id", "==", storeId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
}

export async function addProduct(
  storeId: string, 
  data: Partial<Product>, 
  file: File | null
) {
  const productId = crypto.randomUUID();
  let imageUrl = "";

  if (file) {
    const storageRef = ref(storage, `products/${storeId}/${productId}-${file.name}`);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  const productData = {
    ...data,
    id: productId,
    store_id: storeId,
    images: imageUrl ? [imageUrl] : [],
    inStock: true,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, "products", productId), productData);
  return productData as Product;
}

export async function deleteProductRecord(productId: string, imageUrl?: string) {
  if (imageUrl) {
    try {
      // Create a reference from the download URL to safely delete
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch(e) {
       console.error("Failed to delete product image from storage", e);
    }
  }
  await deleteDoc(doc(db, "products", productId));
}
