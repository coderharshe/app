import Link from "next/link";
import { redirect } from "next/navigation";
import { } from "@prisma/client";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  if (session.scope !== "tenant") {
    redirect("/super-admin");
  }

  if (session.role !== "ADMIN") {
    redirect(`/store/${(await prisma.tenant.findUnique({ where: { id: session.tenantId! } }))?.slug ?? ""}`);
  }

  const [tenant, productCount, orderStats, recentOrders, products] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: session.tenantId! } }),
    prisma.product.count({ where: { tenant_id: session.tenantId! } }),
    prisma.order.aggregate({
      where: { tenant_id: session.tenantId! },
      _count: { id: true },
      _sum: { total_in_paise: true },
    }),
    prisma.order.findMany({
      where: { tenant_id: session.tenantId! },
      orderBy: { created_at: "desc" },
      take: 10,
      include: { payment: true },
    }),
    prisma.product.findMany({ where: { tenant_id: session.tenantId! }, orderBy: { created_at: "desc" }, take: 20 }),
  ]);

  if (!tenant) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      {session.actorSuperAdminId && session.impersonationSessionId ? (
        <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold text-amber-200">Impersonation Mode Active</p>
          <p className="mt-1 text-amber-100">You are acting as tenant admin for support/debugging.</p>
          <form action="/api/super-admin/impersonation/stop" method="post" className="mt-3">
            <input type="hidden" name="sessionId" value={session.impersonationSessionId} readOnly />
            <button className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white" type="submit">
              Stop Impersonation
            </button>
          </form>
        </section>
      ) : null}

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">{tenant.name} Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Tenant slug: {tenant.slug}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-gray-400">Total Products</p>
          <p className="mt-2 text-2xl font-semibold">{productCount}</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-gray-400">Total Orders</p>
          <p className="mt-2 text-2xl font-semibold">{orderStats._count.id}</p>
        </article>
        <article className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-gray-400">Revenue</p>
          <p className="mt-2 text-2xl font-semibold">INR {((orderStats._sum.total_in_paise ?? 0) / 100).toFixed(2)}</p>
        </article>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Products</h2>
          <Link href="/dashboard/products/new" className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white">
            Add Product
          </Link>
        </div>
        <div className="space-y-2">
          {products.map((product) => (
            <article key={product.id} className="flex items-center justify-between rounded border border-white/10 p-3">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-400">INR {(product.price_in_paise / 100).toFixed(2)}</p>
              </div>
              <Link href={`/dashboard/products/${product.id}`} className="rounded border border-white/20 px-3 py-1 text-sm">
                Edit
              </Link>
            </article>
          ))}
          {products.length === 0 ? <p className="text-sm text-gray-400">No products yet.</p> : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <div className="space-y-2">
          {recentOrders.map((order) => (
            <article key={order.id} className="rounded border border-white/10 p-3 text-sm">
              <p>Order: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Payment: {order.payment?.status ?? "N/A"}</p>
              <p>Total: INR {(order.total_in_paise / 100).toFixed(2)}</p>
            </article>
          ))}
          {recentOrders.length === 0 ? <p className="text-sm text-gray-400">No orders yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
