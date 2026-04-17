import Link from "next/link";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Plus,
  Edit,
  IndianRupee,
} from "lucide-react";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatPriceFromPaise } from "@/lib/utils";

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

  const revenue = orderStats._sum.total_in_paise ?? 0;

  return (
    <div className="bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Impersonation Banner */}
        {session.actorSuperAdminId && session.impersonationSessionId ? (
          <section className="rounded-2xl bg-amber-500/10 p-4 ghost-border-visible border-amber-500/30">
            <p className="text-sm font-semibold text-amber-200">Impersonation Mode Active</p>
            <p className="mt-1 text-xs text-amber-100">You are acting as tenant admin for support/debugging.</p>
            <form action="/api/super-admin/impersonation/stop" method="post" className="mt-3">
              <input type="hidden" name="sessionId" value={session.impersonationSessionId} readOnly />
              <button className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 transition-colors" type="submit">
                Stop Impersonation
              </button>
            </form>
          </section>
        ) : null}

        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[var(--on-surface)]">
              {tenant.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
              Store Dashboard — Manage your catalog and orders
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white btn-glow"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </section>

        {/* Analytics Cards */}
        <section className="grid gap-5 sm:grid-cols-3">
          <article className="rounded-2xl bg-emerald-500/10 p-6 ghost-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                <IndianRupee className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--on-surface-variant)]">
                Revenue
              </span>
            </div>
            <p className="text-2xl font-extrabold text-[var(--on-surface)]">
              {formatPriceFromPaise(revenue)}
            </p>
          </article>

          <article className="rounded-2xl bg-indigo-500/10 p-6 ghost-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                <ShoppingCart className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--on-surface-variant)]">
                Total Orders
              </span>
            </div>
            <p className="text-2xl font-extrabold text-[var(--on-surface)]">
              {orderStats._count.id}
            </p>
          </article>

          <article className="rounded-2xl bg-purple-500/10 p-6 ghost-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                <Package className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--on-surface-variant)]">
                Products
              </span>
            </div>
            <p className="text-2xl font-extrabold text-[var(--on-surface)]">
              {productCount}
            </p>
          </article>
        </section>

        {/* Products List */}
        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--on-surface)]">
            Products
          </h2>
          <div className="space-y-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex items-center justify-between rounded-xl bg-[var(--surface-container)] p-4 ghost-border hover:bg-[var(--surface-container-high)] transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--on-surface)]">{product.name}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">
                    {formatPriceFromPaise(product.price_in_paise)}
                  </p>
                </div>
                <Link
                  href={`/dashboard/products/${product.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-container-high)] px-3 py-1.5 text-xs font-medium text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Link>
              </article>
            ))}
            {products.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-container)] py-12 text-center ghost-border">
                <Package className="h-10 w-10 text-[var(--outline)]" />
                <p className="mt-3 text-sm text-[var(--on-surface-variant)]">No products yet</p>
                <Link
                  href="/dashboard/products/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white btn-glow"
                >
                  <Plus className="h-4 w-4" /> Add Your First Product
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Recent Orders */}
        <section className="space-y-4">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--on-surface)]">
            Recent Orders
          </h2>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl bg-[var(--surface-container)] p-4 ghost-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--outline)] font-mono">
                      #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm font-bold text-[var(--on-surface)] mt-0.5">
                      {formatPriceFromPaise(order.total_in_paise)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        order.status === "PAID" || order.status === "DELIVERED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : order.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400"
                            : order.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.payment?.status === "CAPTURED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
                      }`}
                    >
                      {order.payment?.status ?? "N/A"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
            {recentOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-container)] py-12 text-center ghost-border">
                <ShoppingCart className="h-10 w-10 text-[var(--outline)]" />
                <p className="mt-3 text-sm text-[var(--on-surface-variant)]">No orders yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
