import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { Shield, LayoutDashboard, Users, FileText, LogOut } from "lucide-react";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "";

  if (pathname !== "/super-admin/login") {
    const session = await getServerSession();
    if (!session || session.scope !== "platform") {
      redirect("/super-admin/login");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <header className="rounded-2xl bg-[var(--surface-container)] p-5 ghost-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
            <Shield className="h-5 w-5 text-amber-400" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-[var(--on-surface)]">
            Super Admin Portal
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/super-admin"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-container-high)] px-3 py-2 text-xs font-medium text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container-highest)] transition-all"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <Link
            href="/super-admin/tenants"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-container-high)] px-3 py-2 text-xs font-medium text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container-highest)] transition-all"
          >
            <Users className="h-3.5 w-3.5" />
            Tenants
          </Link>
          <Link
            href="/super-admin/audit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-container-high)] px-3 py-2 text-xs font-medium text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container-highest)] transition-all"
          >
            <FileText className="h-3.5 w-3.5" />
            Audit
          </Link>
          <form action="/api/super-admin/auth/logout" method="post" className="ml-auto">
            <button
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--error)]/10 px-3 py-2 text-xs font-medium text-[var(--error)] hover:bg-[var(--error)]/20 transition-all"
              type="submit"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
