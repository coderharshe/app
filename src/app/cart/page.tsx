"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useState, useEffect } from "react";
import { createRazorpayOrder, processOrder } from "@/app/actions/checkout-actions";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  // Checkout flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Handles Cash On Delivery
  const handleCOD = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await processOrder(items, "cod");
      if (res.success) {
        clearCart();
        setSuccess(true);
      } else {
        alert(res.error || "Failed to process order.");
      }
    } catch (err) {
      console.error(err);
      alert("System error during COD checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handles Razorpay Payment Flow
  const handleRazorpay = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Ask Server to generate safe order ID
      const orderRes = await createRazorpayOrder(totalPrice);
      
      if (!orderRes.success || !orderRes.orderId) {
        alert(orderRes.error || "Failed to initiate Razorpay checkout.");
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Interface
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "mock", // Handled via env
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        name: "StoreBase Cart",
        description: "Multi-vendor checkout",
        order_id: orderRes.orderId,
        
        handler: async function (response: any) {
          // 3. On Payment Success -> Trigger Safe Firestore Atomic Commits
          const verifyRes = await processOrder(items, "razorpay", response.razorpay_payment_id);
          if (verifyRes.success) {
            clearCart();
            setSuccess(true);
          } else {
             alert(verifyRes.error || "Database sync failed after payment.");
          }
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed! Please try again.");
      });
      
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("System error initiating payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
         <div className="mx-auto w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckMark />
         </div>
         <h1 className="text-4xl font-extrabold text-white mb-4">Order Received!</h1>
         <p className="text-gray-400 mb-8 max-w-lg mx-auto">Your multi-tenant order has been successfully split and routed to the individual stores. You will receive tracking details shortly.</p>
         <Link href="/" className="inline-flex py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors font-bold">
           Return Home
         </Link>
      </div>
    );
  }

  return (
    <>
      {/* Essential for triggering Razorpay modal securely outside our bundles */}
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white mb-10 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-indigo-500" />
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center text-gray-400 bg-black/20">
            <div className="mx-auto w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-700" />
            </div>
            <p className="text-xl font-semibold text-white mb-2">Cart is empty</p>
            <p className="mb-6 max-w-sm mx-auto">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-colors"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 p-4 rounded-2xl bg-gray-900 border border-white/5"
                >
                  <div className="h-24 w-24 flex-shrink-0 bg-black rounded-xl overflow-hidden border border-white/5">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-800" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                    <p className="text-indigo-400 font-medium">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-black rounded-full p-1 border border-white/10">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-full transition-colors ml-2">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 sticky top-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="space-y-3">
                   <button 
                     onClick={handleRazorpay} 
                     disabled={isProcessing}
                     className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                   >
                     {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : "Pay via Razorpay"}
                   </button>
                   <button 
                     onClick={handleCOD} 
                     disabled={isProcessing}
                     className="w-full py-4 px-6 rounded-full bg-white/5 border border-white/10 text-white font-bold text-md hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
                   >
                     Cash on Delivery
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Simple internal icon for success state
function CheckMark() {
  return (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  );
}
