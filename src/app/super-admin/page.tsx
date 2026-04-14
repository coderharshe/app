import { prisma } from "@/lib/prisma";
import { requirePlatformPageSession } from "@/lib/auth/platform-page";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboardPage() {
  await requirePlatformPageSession();

  const [tenantStats, orderStats, userCount] = await Promise.all([
    prisma.tenant.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.order.aggregate({
      _count: { id: true },
      _sum: { total_in_paise: true },
    }),
    prisma.user.count(),
  ]);

  const totalTenants = tenantStats.reduce((acc, row) => acc + row._count.id, 0);
  const activeTenants = tenantStats.find((row) => row.status === "ACTIVE")?._count.id ?? 0;
  const suspendedTenants = tenantStats.find((row) => row.status === "SUSPENDED")?._count.id ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard label="Total Tenants" value={String(totalTenants)} />
      <MetricCard label="Active Tenants" value={String(activeTenants)} />
      <MetricCard label="Suspended Tenants" value={String(suspendedTenants)} />
      <MetricCard label="Total Orders" value={String(orderStats._count.id)} />
      <MetricCard label="GMV" value={`INR ${((orderStats._sum.total_in_paise ?? 0) / 100).toFixed(2)}`} />
      <MetricCard label="Active Users" value={String(userCount)} />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </article>
  );
}
