"use client";

import { useEffect, useState } from "react";

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
      });
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

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tenant"
          className="rounded border border-white/20 bg-transparent px-3 py-2 text-sm"
        />
        <button className="rounded bg-indigo-600 px-3 py-2 text-sm text-white" onClick={loadTenants}>
          Search
        </button>
      </div>

      {message ? <p className="text-sm text-amber-300">{message}</p> : null}

      <div className="space-y-2">
        {tenants.map((tenant) => (
          <article key={tenant.id} className="rounded border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{tenant.name}</p>
                <p className="text-xs text-gray-400">{tenant.slug} | {tenant.status}</p>
                <p className="text-xs text-gray-400">Users {tenant._count.users}, Products {tenant._count.products}, Orders {tenant._count.orders}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <button className="rounded border border-white/20 px-2 py-1" onClick={() => loadSnapshot(tenant.id)}>Snapshot</button>
                {tenant.status === "SUSPENDED" ? (
                  <button className="rounded bg-emerald-600 px-2 py-1 text-white" onClick={() => activateTenant(tenant.id)}>Activate</button>
                ) : (
                  <button className="rounded bg-red-600 px-2 py-1 text-white" onClick={() => suspendTenant(tenant.id)}>Suspend</button>
                )}
                <button className="rounded bg-indigo-600 px-2 py-1 text-white" onClick={() => startImpersonation(tenant.id)}>Impersonate</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {snapshot && selectedTenant ? (
        <section className="rounded border border-white/10 bg-black/20 p-4 text-sm">
          <h2 className="font-semibold">Tenant Snapshot ({selectedTenant})</h2>
          <p className="mt-2">Recent Orders: {snapshot.recentOrders.length}</p>
          <p>Top Products: {snapshot.topProducts.length}</p>
          <p>Failed Payments: {snapshot.failedPayments.length}</p>
        </section>
      ) : null}
    </div>
  );
}
