"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  Package,
  IndianRupee,
  FileText,
  Tag,
  Image as ImageIcon,
  Boxes,
  ToggleLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ImageUpload } from "@/components/ui";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  priceInRupees: string;
  compareAtRupees: string;
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
    priceInRupees: "",
    compareAtRupees: "",
    imageUrl: "",
    inventory: "0",
    isActive: "true",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
        description: product.description ?? "",
        priceInRupees: String(product.price_in_paise / 100),
        compareAtRupees: product.compare_at_paise ? String(product.compare_at_paise / 100) : "",
        imageUrl: product.image_url ?? "",
        inventory: String(product.inventory),
        isActive: String(product.is_active),
      });
      setLoaded(true);
    }

    void loadProduct();
  }, [id]);

  async function updateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        priceInPaise: Math.round(Number(form.priceInRupees) * 100),
        compareAtPaise: form.compareAtRupees ? Math.round(Number(form.compareAtRupees) * 100) : undefined,
        currency: "INR",
        imageUrl: form.imageUrl || undefined,
        inventory: Number(form.inventory),
        isActive: form.isActive === "true",
      }),
    });

    const json = await response.json();
    setSaving(false);

    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "Failed to update product");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function deleteProduct() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);

    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const json = await response.json();
    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "Failed to delete product");
      setDeleting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (!loaded && !error)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );

  const fields = [
    { key: "name", label: "Product Name", icon: <Package className="h-3.5 w-3.5" />, type: "text", required: true },
    { key: "slug", label: "URL Slug", icon: <Tag className="h-3.5 w-3.5" />, type: "text", required: true },
    { key: "priceInRupees", label: "Price (₹)", icon: <IndianRupee className="h-3.5 w-3.5" />, type: "number", required: true },
    { key: "compareAtRupees", label: "Compare At Price (₹)", icon: <IndianRupee className="h-3.5 w-3.5" />, type: "number", required: false },
    { key: "inventory", label: "Inventory Count", icon: <Boxes className="h-3.5 w-3.5" />, type: "number", required: true },
    { key: "imageUrl", label: "Image URL", icon: <ImageIcon className="h-3.5 w-3.5" />, type: "url", required: false },
  ];

  return (
    <div className="bg-[var(--surface)]">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl bg-[var(--surface-container)] p-6 sm:p-8 ghost-border animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <Package className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-[var(--on-surface)]">
                Edit Product
              </h1>
              <p className="text-xs text-[var(--on-surface-variant)]">Update product details</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={updateProduct}>
            {fields
              .filter((f) => f.key !== "imageUrl")
              .map(({ key, label, icon, type, required }) => (
                <div key={key} className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                    {icon} {label}
                    {required && <span className="text-[var(--error)] ml-0.5">*</span>}
                  </label>
                  <input
                    value={form[key as keyof ProductForm]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    type={type}
                    required={required}
                    min={type === "number" ? "0" : undefined}
                    step={key === "priceInRupees" || key === "compareAtRupees" ? "1" : undefined}
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
                required
                minLength={10}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all resize-none"
              />
            </div>

            {/* Active Toggle */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                <ToggleLeft className="h-3.5 w-3.5" /> Status
              </label>
              <select
                value={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value }))}
                className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-[var(--error-container)]/20 p-3 text-xs text-[var(--error)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white btn-glow disabled:opacity-50 transition-all"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={deleteProduct}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--error)]/10 px-4 py-3 text-sm font-semibold text-[var(--error)] hover:bg-[var(--error)]/20 transition-all"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
