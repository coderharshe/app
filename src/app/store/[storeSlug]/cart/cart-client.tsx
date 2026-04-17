"use client";

import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Loader2,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { clearStoredCart, getStoredCart } from "@/components/cart/add-to-cart";
import { formatPriceFromPaise } from "@/lib/utils";

type CartItem = {
  productId: string;
  quantity: number;
};

type HydratedItem = {
  productId: string;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  priceInPaise: number;
  lineTotalPaise: number;
};

type Props = {
  tenantSlug: string;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

/* ── Labeled Input ── */
function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--on-surface-variant)]">
        {label}
        {required && <span className="text-[var(--error)] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
      />
    </div>
  );
}

/* ── Shipping Form ── */
function ShippingForm({
  onSubmit,
  loading,
}: {
  onSubmit: (shipping: Record<string, string>) => Promise<void>;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
  });

  const update = (key: string) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(form);
      }}
    >
      <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-[var(--on-surface)]">
        Shipping Information
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Full Name" value={form.name} onChange={update("name")} />
        <FormField label="Email" type="email" value={form.email} onChange={update("email")} />
        <FormField label="Phone" type="tel" value={form.phone} onChange={update("phone")} />
        <FormField label="Address Line 1" value={form.address1} onChange={update("address1")} />
        <FormField label="Address Line 2" value={form.address2} onChange={update("address2")} required={false} />
        <FormField label="City" value={form.city} onChange={update("city")} />
        <FormField label="State" value={form.state} onChange={update("state")} />
        <FormField label="PIN Code" value={form.postalCode} onChange={update("postalCode")} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white btn-glow disabled:opacity-50 transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Pay with Razorpay
          </>
        )}
      </button>
    </form>
  );
}

/* ── Cart Client ── */
export default function StoreCartClient({ tenantSlug }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [items, setItems] = useState<HydratedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalInPaise = useMemo(
    () => items.reduce((acc, item) => acc + item.lineTotalPaise, 0),
    [items]
  );

  useEffect(() => {
    setCart(getStoredCart(tenantSlug));
  }, [tenantSlug]);

  useEffect(() => {
    if (cart.length === 0) {
      setItems([]);
      return;
    }

    async function syncCart() {
      setError(null);

      const saveResponse = await fetch(`/api/cart?tenantSlug=${tenantSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      if (!saveResponse.ok) {
        setError("Please login as customer to load cart.");
        return;
      }

      const listResponse = await fetch(`/api/cart?tenantSlug=${tenantSlug}`);
      const listJson = await listResponse.json();
      if (!listResponse.ok || !listJson.success) {
        setError("Failed to fetch cart data");
        return;
      }

      setItems(listJson.data.items as HydratedItem[]);
    }

    void syncCart();
  }, [cart, tenantSlug]);

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0);

      const key = `cart:${tenantSlug}`;
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  }

  function removeItem(productId: string) {
    setCart((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      const key = `cart:${tenantSlug}`;
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  }

  async function checkout(shipping: Record<string, string>) {
    setLoading(true);
    setError(null);

    const orderResponse = await fetch(`/api/orders?tenantSlug=${tenantSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, shipping }),
    });

    const orderJson = await orderResponse.json();
    if (!orderResponse.ok || !orderJson.success) {
      setLoading(false);
      setError(orderJson.error?.message ?? "Unable to create order");
      return;
    }

    const paymentOrderResponse = await fetch(`/api/payments/create-order?tenantSlug=${tenantSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderJson.data.orderId }),
    });

    const paymentOrderJson = await paymentOrderResponse.json();
    if (!paymentOrderResponse.ok || !paymentOrderJson.success) {
      setLoading(false);
      setError(paymentOrderJson.error?.message ?? "Unable to initiate payment");
      return;
    }

    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: paymentOrderJson.data.amountInPaise,
      currency: paymentOrderJson.data.currency,
      name: `${tenantSlug} checkout`,
      order_id: paymentOrderJson.data.razorpayOrderId,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verifyResponse = await fetch(`/api/payments/verify?tenantSlug=${tenantSlug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderJson.data.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });

        const verifyJson = await verifyResponse.json();
        if (!verifyResponse.ok || !verifyJson.success) {
          setLoading(false);
          setError(verifyJson.error?.message ?? "Payment verification failed");
          return;
        }

        clearStoredCart(tenantSlug);
        setCart([]);
        setItems([]);
        setLoading(false);
        window.location.href = `/store/${tenantSlug}/checkout/success?order=${orderJson.data.orderId}`;
      },
    });

    razorpay.open();
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-[var(--primary)]" />
              <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[var(--on-surface)]">
                Your Cart
              </h1>
              {items.length > 0 && (
                <span className="rounded-full bg-[var(--primary-container)] px-2.5 py-0.5 text-xs font-bold text-white">
                  {items.length}
                </span>
              )}
            </div>
            <Link
              href={`/store/${tenantSlug}`}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-[var(--error-container)]/20 p-4 text-sm text-[var(--error)]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-container)] py-20 text-center ghost-border">
              <ShoppingCart className="h-16 w-16 text-[var(--outline)]" />
              <p className="mt-4 font-medium text-[var(--on-surface-variant)]">Your cart is empty</p>
              <Link
                href={`/store/${tenantSlug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-white btn-glow"
              >
                Browse Products
              </Link>
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <article
                    key={item.productId}
                    className="flex gap-4 rounded-2xl bg-[var(--surface-container)] p-4 ghost-border animate-fade-in"
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-container-low)]">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-[var(--outline)]" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--on-surface)] truncate">{item.name}</h3>
                        <p className="text-xs text-[var(--on-surface-variant)]">
                          Unit: {formatPriceFromPaise(item.priceInPaise)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-highest)] transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[var(--on-surface)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-highest)] transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[var(--on-surface)]">
                            {formatPriceFromPaise(item.lineTotalPaise)}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg p-1.5 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Right: Order Summary + Shipping */}
              <div className="space-y-5">
                <div className="rounded-2xl bg-[var(--surface-container)] p-5 ghost-border sticky top-20">
                  <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-[var(--on-surface)] mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-[var(--on-surface-variant)]">
                      <span>Subtotal ({items.length} items)</span>
                      <span>{formatPriceFromPaise(totalInPaise)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--on-surface-variant)]">
                      <span>Shipping</span>
                      <span className="text-emerald-400">Free</span>
                    </div>
                    <div className="my-3 h-px bg-[var(--outline-variant)] opacity-20" />
                    <div className="flex justify-between">
                      <span className="font-bold text-[var(--on-surface)]">Total</span>
                      <span className="text-lg font-extrabold text-[var(--on-surface)]">
                        {formatPriceFromPaise(totalInPaise)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[var(--surface-container)] p-5 ghost-border">
                  <ShippingForm onSubmit={checkout} loading={loading} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
