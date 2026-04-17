"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  IndianRupee,
  FileText,
  Tag,
  Image as ImageIcon,
  Boxes,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ImageUpload } from "@/components/ui";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    priceInRupees: "",
    inventory: "",
    imageUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Convert rupees to paise for storage
    const priceInPaise = Math.round(Number(form.priceInRupees) * 100);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: form.description,
        priceInPaise,
        inventory: Number(form.inventory),
        imageUrl: form.imageUrl || undefined,
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

  const fields = [
    { key: "name", label: "Product Name", icon: <Package className="h-3.5 w-3.5" />, type: "text", placeholder: "e.g., Premium Wireless Earbuds", required: true },
    { key: "slug", label: "URL Slug", icon: <Tag className="h-3.5 w-3.5" />, type: "text", placeholder: "auto-generated from name (optional)", required: false },
    { key: "priceInRupees", label: "Price (₹)", icon: <IndianRupee className="h-3.5 w-3.5" />, type: "number", placeholder: "e.g., 1299", required: true },
    { key: "inventory", label: "Inventory Count", icon: <Boxes className="h-3.5 w-3.5" />, type: "number", placeholder: "e.g., 50", required: true },
    { key: "imageUrl", label: "Image URL", icon: <ImageIcon className="h-3.5 w-3.5" />, type: "url", placeholder: "https://example.com/image.jpg (optional)", required: false },
  ];

  return (
    <div className="bg-[var(--surface)]">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-[var(--surface-container)] p-6 sm:p-8 ghost-border animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-[var(--on-surface)]">
                Add Product
              </h1>
              <p className="text-xs text-[var(--on-surface-variant)]">
                Create a new product listing for your store
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Input Fields */}
            {fields
              .filter((f) => f.key !== "imageUrl")
              .map(({ key, label, icon, type, placeholder, required }) => (
                <div key={key} className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                    {icon} {label}
                    {required && <span className="text-[var(--error)] ml-0.5">*</span>}
                  </label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    min={type === "number" ? "0" : undefined}
                    step={key === "priceInRupees" ? "1" : undefined}
                    className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
                  />
                </div>
              ))}

            {/* Image Upload Section */}
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            />

            {/* Description */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                <FileText className="h-3.5 w-3.5" /> Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product..."
                rows={4}
                className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-[var(--error-container)]/20 p-3 text-xs text-[var(--error)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white btn-glow disabled:opacity-50 transition-all mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
