"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  priceInPaise: string;
  compareAtPaise: string;
  currency: string;
  imageUrl: string;
  inventory: string;
  isActive: string;
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    priceInPaise: "",
    compareAtPaise: "",
    currency: "INR",
    imageUrl: "",
    inventory: "0",
    isActive: "true",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      const response = await fetch(`/api/products/${id}`);
      const json = await response.json();
      if (!response.ok || !json.success) {
        setError(json.error?.message ?? "Failed to load product");
        return;
      }

      const product = json.data;
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceInPaise: String(product.price_in_paise),
        compareAtPaise: product.compare_at_paise ? String(product.compare_at_paise) : "",
        currency: product.currency,
        imageUrl: product.image_url ?? "",
        inventory: String(product.inventory),
        isActive: String(product.is_active),
      });
    }

    void loadProduct();
  }, [id]);

  async function updateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        priceInPaise: Number(form.priceInPaise),
        compareAtPaise: form.compareAtPaise ? Number(form.compareAtPaise) : undefined,
        currency: form.currency,
        imageUrl: form.imageUrl || undefined,
        inventory: Number(form.inventory),
        isActive: form.isActive === "true",
      }),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "Failed to update product");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function deleteProduct() {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const json = await response.json();
    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "Failed to delete product");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-black/20 p-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <form className="mt-6 space-y-3" onSubmit={updateProduct}>
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            value={value}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={key}
            className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          />
        ))}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="flex gap-3">
          <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white">
            Save
          </button>
          <button
            type="button"
            className="rounded border border-red-500/50 px-4 py-2 text-red-300"
            onClick={deleteProduct}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
