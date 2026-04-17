"use client";

import { useEffect, useState } from "react";
import { FileText, User, UserCog, Store, Clock, Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/super-admin/audit?limit=100");
      const json = await response.json();
      if (response.ok && json.success) {
        setLogs(json.data.logs);
      }
      setLoading(false);
    }

    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--on-surface)] flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Audit Activity Feed
      </h1>

      <div className="space-y-2">
        {logs.map((log) => (
          <article
            key={log.id}
            className="rounded-2xl bg-[var(--surface-container)] p-4 ghost-border hover:bg-[var(--surface-container-high)] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-[var(--on-surface)]">{log.action}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--on-surface-variant)]">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {log.target_type} {log.target_id ? `#${log.target_id.slice(0, 8)}` : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UserCog className="h-3 w-3" />
                    {log.actor_super_admin?.email ?? "—"}
                  </span>
                  {log.effective_user && (
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {log.effective_user.email}
                    </span>
                  )}
                  {log.tenant && (
                    <span className="inline-flex items-center gap-1">
                      <Store className="h-3 w-3" />
                      {log.tenant.name}
                    </span>
                  )}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--outline)] whitespace-nowrap">
                <Clock className="h-3 w-3" />
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          </article>
        ))}

        {logs.length === 0 && (
          <div className="flex flex-col items-center py-16 rounded-2xl bg-[var(--surface-container)] ghost-border text-center">
            <FileText className="h-10 w-10 text-[var(--outline)]" />
            <p className="mt-3 text-sm text-[var(--on-surface-variant)]">No audit entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
