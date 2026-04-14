import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenantWithProductsBySlug } from "@/lib/data";

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
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-bold">{tenant.name}</h1>
        <p className="mt-1 text-sm text-gray-400">Tenant slug: {tenant.slug}</p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Products</h2>
          <Link href={`/store/${tenant.slug}/cart`} className="rounded border border-white/20 px-3 py-1.5 text-sm">
            View Cart
          </Link>
        </div>
        {tenant.products.length === 0 ? (
          <p className="text-sm text-gray-400">No products yet for this store.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenant.products.map((product) => (
              <article key={product.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">{product.description}</p>
                <p className="mt-3 text-sm font-medium">INR {(product.price_in_paise / 100).toFixed(2)}</p>
                <Link
                  href={`/store/${tenant.slug}/product/${product.id}`}
                  className="mt-4 inline-block rounded bg-white/10 px-3 py-1.5 text-sm"
                >
                  View Product
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
