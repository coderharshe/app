"use client";

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
    alert("Item added to cart");
  }

  return (
    <button className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white" onClick={addToCart}>
      Add To Cart
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
