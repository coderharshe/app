import Link from "next/link";
import { getActiveTenants } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tenants = await getActiveTenants();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Multi-tenant eCommerce SaaS</h1>
        <p className="mt-2 max-w-2xl text-gray-300">
          Store owners onboard as separate tenants while customers shop in isolated storefronts. Supports
          subdomain and path-based tenancy with secure API boundaries.
        </p>
        <div className="mt-5 flex gap-3">
          <Link href="/register" className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
            Onboard Store Owner
          </Link>
          <Link href="/login" className="rounded border border-white/20 px-4 py-2 text-sm font-medium">
            Login
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Stores</h2>
        {tenants.length === 0 ? (
          <p className="text-sm text-gray-400">No stores yet. Create one from register page.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <article key={tenant.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-lg font-semibold">{tenant.name}</h3>
                <p className="text-sm text-gray-400">/{tenant.slug}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/store/${tenant.slug}`}
                    className="rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
                  >
                    Browse Store
                  </Link>
                  <Link
                    href={`/login?tenant=${tenant.slug}`}
                    className="rounded border border-white/20 px-3 py-1.5 text-sm"
                  >
                    Customer Login
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
