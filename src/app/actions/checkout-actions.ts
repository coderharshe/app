"use server";

import Razorpay from "razorpay";
import { adminDb } from "@/lib/firebase/admin";
import { CartItem } from "@/lib/cart-context";

// Only initialize if keys exist to avoid server crash on boot without env vars
let razorpay: Razorpay | null = null;
if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function createRazorpayOrder(amount: number) {
  if (!razorpay) {
    return { success: false, error: "Razorpay keys not configured in environment." };
  }
  
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to smallest currency unit (paise)
      currency: "INR",
      receipt: "rcpt_" + Math.random().toString(36).substring(7),
    });
    return { success: true, orderId: order.id };
  } catch (err: any) {
    console.error("Razorpay order creation failed", err);
    return { success: false, error: err?.message || "Failed to create Razorpay order" };
  }
}

export async function processOrder(
  items: CartItem[], 
  method: "cod" | "razorpay", 
  paymentId?: string
) {
  try {
    // 1. Group items by store_id to support multi-tenant cart checkouts
    const storeOrders = new Map<string, CartItem[]>();
    
    items.forEach(item => {
      if (!storeOrders.has(item.store_id)) {
         storeOrders.set(item.store_id, []);
      }
      storeOrders.get(item.store_id)!.push(item);
    });

    const batch = adminDb.batch();
    
    // 2. Loop through each store's slice of the cart
    for (const [storeId, storeItems] of storeOrders.entries()) {
        const orderRef = adminDb.collection("orders").doc();
        const totalAmount = storeItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
        
        batch.set(orderRef, {
          store_id: storeId,
          total_amount: totalAmount,
          status: method === "cod" ? "pending" : "paid",
          payment_method: method,
          payment_id: paymentId || null,
          created_at: new Date().toISOString()
        });
        
        for (const item of storeItems) {
           const itemRef = adminDb.collection("order_items").doc();
           batch.set(itemRef, {
              order_id: orderRef.id,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price, // snapshot price at purchase
           });
        }
    }
    
    // 3. Atomically commit all multi-tenant orders and items across the platform
    await batch.commit();
    return { success: true };
    
  } catch (err: any) {
    console.error("Order processing failed", err);
    return { success: false, error: err?.message || "Failed to process order" };
  }
}
