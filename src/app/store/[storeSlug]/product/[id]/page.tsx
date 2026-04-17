import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart";
import { getProductByIdAndTenant } from "@/lib/data";
import { formatPriceFromPaise } from "@/lib/utils";

interface Props {
  params: Promise<{ storeSlug: string; id: string }>;
}

export default async function TenantProductPage({ params }: Props) {
  const { storeSlug, id } = await params;
  const product = await getProductByIdAndTenant(id, storeSlug);

  if (!product || product.tenant.slug !== storeSlug) {
    notFound();
  }

  const price = formatPriceFromPaise(product.price_in_paise);
  const inStock = product.inventory > 0;

  return (
    <div className="bg-[var(--surface)]">
      {/* ── Breadcrumb ── */}
      <div className="bg-[var(--surface-container-low)]">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-xs text-[var(--on-surface-variant)] sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/store/${storeSlug}`} className="hover:text-[var(--primary)] transition-colors">
            {product.tenant.name}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-[var(--on-surface)] truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* ── Product Section ── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface-container)] ghost-border">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ShoppingCart className="h-16 w-16 text-[var(--outline)]" />
                </div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[var(--on-surface)] sm:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-[var(--outline-variant)]"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--on-surface-variant)]">4.0 (--)</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[var(--on-surface)]">
                {price}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mt-4 flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Out of Stock</span>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton tenantSlug={storeSlug} productId={product.id} />
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: <Truck className="h-4 w-4" />, text: "Free Delivery", sub: "On orders above ₹499" },
                { icon: <RotateCcw className="h-4 w-4" />, text: "7-Day Returns", sub: "Easy replacements" },
                { icon: <Shield className="h-4 w-4" />, text: "Secure Payment", sub: "Razorpay powered" },
              ].map(({ icon, text, sub }) => (
                <div
                  key={text}
                  className="flex items-start gap-3 rounded-xl bg-[var(--surface-container)] p-3.5 ghost-border"
                >
                  <span className="mt-0.5 text-[var(--primary)]">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--on-surface)]">{text}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller */}
            <div className="mt-6 rounded-xl bg-[var(--surface-container)] p-4 ghost-border">
              <p className="text-xs text-[var(--on-surface-variant)]">Sold by</p>
              <Link
                href={`/store/${storeSlug}`}
                className="text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                {product.tenant.name}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        {product.description && (
          <div className="mt-12 rounded-2xl bg-[var(--surface-container)] p-6 ghost-border sm:p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--on-surface)]">
              Product Description
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--on-surface-variant)]">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
