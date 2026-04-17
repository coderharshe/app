import Link from "next/link";
import { notFound } from "next/navigation";
import { Store, Star, ShoppingCart } from "lucide-react";
import { getTenantWithProductsBySlug } from "@/lib/data";
import { ProductCard } from "@/components/ui";

interface StorePageProps {
  params: Promise<{ storeSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;
  const tenant = await getTenantWithProductsBySlug(storeSlug);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="space-y-0">
      {/* ── Store Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary-container)] via-[var(--secondary-container)] to-[var(--surface-container)]">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.08] blur-[80px]" />
        <div className="absolute right-0 -bottom-10 h-48 w-48 rounded-full bg-[var(--tertiary)] opacity-[0.06] blur-[60px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-start gap-5">
            {/* Store Icon */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-container)] ghost-border shadow-lg">
              <Store className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white sm:text-4xl">
                {tenant.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-white/80">4.8</span>
                  <span className="text-sm text-white/50">(124 reviews)</span>
                </div>
                <span className="text-sm text-white/50">
                  {tenant.products.length} products
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="bg-[var(--surface-container-low)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
            >
              Home
            </Link>
            <span className="text-xs text-[var(--outline)]">/</span>
            <span className="text-xs font-medium text-[var(--on-surface)]">
              {tenant.name}
            </span>
          </div>
          <Link
            href={`/store/${tenant.slug}/cart`}
            className="btn-secondary px-5 py-2 text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            View Cart
          </Link>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--on-surface)]">
            All Products
          </h2>

          {tenant.products.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-container)] py-16 text-center ghost-border">
              <ShoppingCart className="h-12 w-12 text-[var(--outline)]" />
              <p className="mt-4 text-sm font-medium text-[var(--on-surface-variant)]">
                No products available in this store yet
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
              {tenant.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description ?? ""}
                  priceInPaise={product.price_in_paise}
                  storeSlug={tenant.slug}
                  imageUrl={product.image_url}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
