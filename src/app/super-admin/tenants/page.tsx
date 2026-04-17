"use client";

import { useEffect, useState } from "react";
import { formatPriceFromPaise } from "@/lib/utils";
import {
  Search,
  Store,
  Users,
  Package,
  ShoppingCart,
  CheckCircle2,
  Ban,
  Eye,
  UserCog,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  suspended_reason: string | null;
  _count: {
    users: number;
    products: number;
    orders: number;
  };
};

type Snapshot = {
  recentOrders: Array<{ id: string; status: string; total_in_paise: number }>;
  topProducts: Array<{ product_name: string; _sum: { quantity: number | null; line_total_paise: number | null } }>;
  failedPayments: Array<{ id: string; order_id: string; amount_in_paise: number }>;
};

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTenants() {
    const response = await fetch(`/api/super-admin/tenants?search=${encodeURIComponent(search)}`);
    const json = await response.json();
    if (response.ok && json.success) {
      setTenants(json.data.tenants);
    }
  }

  useEffect(() => {
    fetch("/api/super-admin/tenants")
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setTenants(json.data.tenants);
        }
      })
      .catch(() => {
        setMessage("Failed to load tenants");
      })
      .finally(() => setLoading(false));
  }, []);

  async function suspendTenant(id: string) {
    const reason = window.prompt("Suspension reason");
    if (!reason) return;

    const response = await fetch(`/api/super-admin/tenants/${id}/suspend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const json = await response.json();
    setMessage(json.success ? "Tenant suspended" : json.error?.message ?? "Failed");
    await loadTenants();
  }

  async function activateTenant(id: string) {
    const response = await fetch(`/api/super-admin/tenants/${id}/activate`, { method: "POST" });
    const json = await response.json();
    setMessage(json.success ? "Tenant activated" : json.error?.message ?? "Failed");
    await loadTenants();
  }

  async function loadSnapshot(id: string) {
    setSelectedTenant(id);
    const response = await fetch(`/api/super-admin/tenants/${id}/snapshot`);
    const json = await response.json();
    if (response.ok && json.success) {
      setSnapshot(json.data.snapshot);
    }
  }

  async function startImpersonation(tenantId: string) {
    const userId = window.prompt("Enter tenant admin user ID to impersonate");
    const reason = window.prompt("Reason for impersonation");
    if (!userId || !reason) return;

    const response = await fetch(`/api/super-admin/impersonation/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, tenantAdminUserId: userId, reason }),
    });
    const json = await response.json();
    if (response.ok && json.success) {
      window.location.href = "/dashboard";
      return;
    }
    setMessage(json.error?.message ?? "Failed to start impersonation");
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Active</span>;
      case "SUSPENDED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400"><Ban className="h-3 w-3" /> Suspended</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--outline)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadTenants()}
            placeholder="Search tenants..."
            className="w-full rounded-xl bg-[var(--surface-container-lowest)] pl-10 pr-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
          />
        </div>
        <button
          className="rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white btn-glow"
          onClick={loadTenants}
        >
          Search
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="flex items-center justify-between rounded-xl bg-amber-500/10 p-3 text-sm text-amber-300">
          <span>{message}</span>
          <button onClick={() => setMessage(null)}>
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tenants Grid */}
      <div className="space-y-3">
        {tenants.map((tenant) => (
          <article key={tenant.id} className="rounded-2xl bg-[var(--surface-container)] p-5 ghost-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-container-high)]">
                    <Store className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--on-surface)]">{tenant.name}</p>
                    <p className="text-xs text-[var(--on-surface-variant)] font-mono">{tenant.slug}</p>
                  </div>
                  {statusBadge(tenant.status)}
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--on-surface-variant)] pl-12">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {tenant._count.users} users</span>
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {tenant._count.products} products</span>
                  <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> {tenant._count.orders} orders</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn-secondary px-3 py-1.5 text-xs"
                  onClick={() => loadSnapshot(tenant.id)}
                >
                  <Eye className="h-3.5 w-3.5" /> Snapshot
                </button>
                {tenant.status === "SUSPENDED" ? (
                  <button
                    className="btn px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    onClick={() => activateTenant(tenant.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Activate
                  </button>
                ) : (
                  <button
                    className="btn px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                    onClick={() => suspendTenant(tenant.id)}
                  >
                    <Ban className="h-3.5 w-3.5" /> Suspend
                  </button>
                )}
                <button
                  className="btn px-3 py-1.5 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20"
                  onClick={() => startImpersonation(tenant.id)}
                >
                  <UserCog className="h-3.5 w-3.5" /> Impersonate
                </button>
              </div>
            </div>
          </article>
        ))}
        {tenants.length === 0 && (
          <div className="flex flex-col items-center py-16 rounded-2xl bg-[var(--surface-container)] ghost-border text-center">
            <Store className="h-10 w-10 text-[var(--outline)]" />
            <p className="mt-3 text-sm text-[var(--on-surface-variant)]">No tenants found</p>
          </div>
        )}
      </div>

      {/* Snapshot Panel */}
      {snapshot && selectedTenant && (
        <section className="rounded-2xl bg-[var(--surface-container)] p-6 ghost-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-heading)] text-base font-bold text-[var(--on-surface)]">
              Tenant Snapshot
            </h2>
            <button
              onClick={() => { setSnapshot(null); setSelectedTenant(null); }}
              className="text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-[var(--surface-container-low)] p-4 ghost-border">
              <p className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-2">Recent Orders</p>
              {snapshot.recentOrders.length > 0 ? (
                <div className="space-y-1.5">
                  {snapshot.recentOrders.map((o) => (
                    <div key={o.id} className="flex justify-between text-xs">
                      <span className="font-mono text-[var(--outline)]">#{o.id.slice(0, 8)}</span>
                      <span className="font-semibold text-[var(--on-surface)]">{formatPriceFromPaise(o.total_in_paise)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--outline)]">None</p>
              )}
            </div>

            <div className="rounded-xl bg-[var(--surface-container-low)] p-4 ghost-border">
              <p className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-2">Top Products</p>
              {snapshot.topProducts.length > 0 ? (
                <div className="space-y-1.5">
                  {snapshot.topProducts.map((p, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-[var(--on-surface)] truncate max-w-[120px]">{p.product_name}</span>
                      <span className="text-[var(--on-surface-variant)]">{p._sum.quantity ?? 0} sold</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--outline)]">None</p>
              )}
            </div>

            <div className="rounded-xl bg-[var(--surface-container-low)] p-4 ghost-border">
              <p className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wider mb-2">Failed Payments</p>
              {snapshot.failedPayments.length > 0 ? (
                <div className="space-y-1.5">
                  {snapshot.failedPayments.map((p) => (
                    <div key={p.id} className="flex justify-between text-xs">
                      <span className="font-mono text-[var(--outline)]">#{p.order_id.slice(0, 8)}</span>
                      <span className="text-red-400">{formatPriceFromPaise(p.amount_in_paise)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400">None ✓</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
