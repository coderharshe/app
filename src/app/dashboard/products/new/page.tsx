"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    priceInPaise: "",
    inventory: "",
    imageUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        priceInPaise: Number(form.priceInPaise),
        inventory: Number(form.inventory),
      }),
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "Unable to create product");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-black/20 p-6">
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            value={value}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={key}
            required={key !== "imageUrl"}
            className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          />
        ))}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-white">
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
