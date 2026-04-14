"use client";

import { useEffect, useState } from "react";

type AuditLog = {
  id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  created_at: string;
  actor_super_admin: { name: string; email: string } | null;
  effective_user: { name: string; email: string } | null;
  tenant: { name: string; slug: string } | null;
};

export default function SuperAdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/super-admin/audit?limit=100");
      const json = await response.json();
      if (response.ok && json.success) {
        setLogs(json.data.logs);
      }
    }

    void load();
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Audit Activity Feed</h1>
      {logs.map((log) => (
        <article key={log.id} className="rounded border border-white/10 bg-black/20 p-3 text-sm">
          <p className="font-medium">{log.action}</p>
          <p className="text-gray-400">Target: {log.target_type} {log.target_id ?? "-"}</p>
          <p className="text-gray-400">Actor: {log.actor_super_admin?.email ?? "-"}</p>
          <p className="text-gray-400">Effective User: {log.effective_user?.email ?? "-"}</p>
          <p className="text-gray-400">Tenant: {log.tenant ? `${log.tenant.name} (${log.tenant.slug})` : "-"}</p>
          <p className="text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
        </article>
      ))}
      {logs.length === 0 ? <p className="text-sm text-gray-400">No audit entries yet.</p> : null}
    </div>
  );
}
