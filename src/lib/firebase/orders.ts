import { db } from "./config";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { Order, OrderItem } from "@/types";

export type OrderWithItems = Order & { 
  items: OrderItem[];
  created_at?: string;
};

export async function fetchStoreOrders(storeId: string): Promise<OrderWithItems[]> {
  const q = query(
    collection(db, "orders"), 
    where("store_id", "==", storeId) 
  );
  const snap = await getDocs(q);
  
  const orders: OrderWithItems[] = [];
  
  // For each order, fetch its line items
  // Note: For extreme scaling this could be a parallel Promise.all, but sequentially mapped for simplicity
  for (const docSnap of snap.docs) {
    const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
    
    const itemsQ = query(collection(db, "order_items"), where("order_id", "==", docSnap.id));
    const itemsSnap = await getDocs(itemsQ);
    const items = itemsSnap.docs.map(i => ({ id: i.id, ...i.data() }) as OrderItem);
    
    orders.push({ ...orderData, items });
  }

  // Sort by date descending locally to skip index issues
  return orders.sort(
    (a, b) =>
      new Date(b.created_at || b.createdAt || 0).getTime() -
      new Date(a.created_at || a.createdAt || 0).getTime()
  );
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
   await updateDoc(doc(db, "orders", orderId), { status });
}
