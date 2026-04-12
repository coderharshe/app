export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Store as StoreIcon, Package } from "lucide-react";
import { ProductCard } from "@/components/ui";
import { getStoreBySlug, getProductsByStoreId } from "@/lib/firebase/queries";

interface StorePageProps {
  params: Promise<{ storeSlug: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    return { title: "Store Not Found" };
  }

  return {
    title: store.name,
    description: store.description,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    notFound();
  }

  const products = await getProductsByStoreId(store.id);

  return (
    <div>
      {/* ── Store banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background gradient effect using store's theme color */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute left-0 top-0 h-full w-full opacity-10 blur-[100px]"
            style={{
              background: `radial-gradient(circle at 30% 50%, ${store.themeColor}, transparent 60%)`,
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{ backgroundColor: `${store.themeColor}20` }}
            >
              <StoreIcon
                className="h-8 w-8"
                style={{ color: store.themeColor }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                {store.name}
              </h1>
              <p className="mt-1 max-w-xl text-sm text-gray-400">
                {store.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products grid ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-bold text-white">
              All Products
            </h2>
            <span className="ml-2 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-400">
              {products.length}
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20">
            <Package className="h-12 w-12 text-gray-700" />
            <p className="mt-4 text-sm text-gray-500">
              This store hasn&apos;t added any products yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
