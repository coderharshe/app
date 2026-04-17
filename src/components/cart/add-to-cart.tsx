"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

type CartItem = {
  productId: string;
  quantity: number;
};

function storageKey(tenantSlug: string) {
  return `cart:${tenantSlug}`;
}

export function AddToCartButton({
  tenantSlug,
  productId,
}: {
  tenantSlug: string;
  productId: string;
}) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const key = storageKey(tenantSlug);
    const current = localStorage.getItem(key);
    const parsed: CartItem[] = current ? (JSON.parse(current) as CartItem[]) : [];
    const existing = parsed.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      parsed.push({ productId, quantity: 1 });
    }

    localStorage.setItem(key, JSON.stringify(parsed));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={addToCart}
      disabled={added}
      className={`btn px-8 py-3.5 ${
        added
          ? "bg-emerald-500/10 text-emerald-400 ghost-border pointer-events-none"
          : "btn-primary w-full sm:w-auto"
      }`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </>
      )}
    </button>
  );
}

export function getStoredCart(tenantSlug: string): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const key = storageKey(tenantSlug);
  const current = localStorage.getItem(key);
  return current ? (JSON.parse(current) as CartItem[]) : [];
}

export function clearStoredCart(tenantSlug: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(storageKey(tenantSlug));
}
