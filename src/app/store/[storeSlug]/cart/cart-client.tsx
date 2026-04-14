"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearStoredCart, getStoredCart } from "@/components/cart/add-to-cart";

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

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(form);
      }}
    >
      {Object.entries(form).map(([key, value]) => (
        <input
          key={key}
          required={key !== "address2"}
          value={value}
          onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
          placeholder={key}
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2 text-sm"
        />
      ))}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Processing..." : "Checkout with Razorpay"}
      </button>
    </form>
  );
}

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
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Cart</h1>
          <Link href={`/store/${tenantSlug}`} className="text-sm text-gray-300">
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? <p className="text-sm text-gray-400">No items in cart.</p> : null}

        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.productId} className="rounded border border-white/10 bg-black/20 p-3">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
              <p className="text-sm">INR {(item.lineTotalPaise / 100).toFixed(2)}</p>
            </article>
          ))}
        </div>

        <p className="text-lg font-semibold">Total: INR {(totalInPaise / 100).toFixed(2)}</p>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        {items.length > 0 ? <ShippingForm onSubmit={checkout} loading={loading} /> : null}
      </div>
    </>
  );
}
