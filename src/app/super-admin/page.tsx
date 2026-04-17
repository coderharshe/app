import { prisma } from "@/lib/prisma";
import { requirePlatformPageSession } from "@/lib/auth/platform-page";
import { formatPriceFromPaise } from "@/lib/utils";
import {
  Store,
  ShoppingCart,
  IndianRupee,
  Users,
  CheckCircle2,
  Ban,
} from "lucide-react";

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

  const metrics = [
    { label: "Total Tenants", value: String(totalTenants), icon: <Store className="h-5 w-5 text-indigo-400" />, bg: "bg-indigo-500/10" },
    { label: "Active Tenants", value: String(activeTenants), icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />, bg: "bg-emerald-500/10" },
    { label: "Suspended", value: String(suspendedTenants), icon: <Ban className="h-5 w-5 text-red-400" />, bg: "bg-red-500/10" },
    { label: "Total Orders", value: String(orderStats._count.id), icon: <ShoppingCart className="h-5 w-5 text-blue-400" />, bg: "bg-blue-500/10" },
    { label: "GMV", value: formatPriceFromPaise(orderStats._sum.total_in_paise ?? 0), icon: <IndianRupee className="h-5 w-5 text-emerald-400" />, bg: "bg-emerald-500/10" },
    { label: "Active Users", value: String(userCount), icon: <Users className="h-5 w-5 text-purple-400" />, bg: "bg-purple-500/10" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map(({ label, value, icon, bg }) => (
        <article key={label} className={`rounded-2xl ${bg} p-5 ghost-border`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              {icon}
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--on-surface-variant)]">
              {label}
            </span>
          </div>
          <p className="text-xl font-extrabold text-[var(--on-surface)]">{value}</p>
        </article>
      ))}
    </div>
  );
}
