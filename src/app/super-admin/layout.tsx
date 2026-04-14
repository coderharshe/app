import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";

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
    <div className="space-y-6">
      <header className="rounded-xl border border-white/10 bg-black/20 p-4">
        <h1 className="text-xl font-semibold">Super Admin Portal</h1>
        <div className="mt-2 flex gap-3 text-sm">
          <Link href="/super-admin" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/super-admin/tenants" className="text-gray-300 hover:text-white">
            Tenants
          </Link>
          <Link href="/super-admin/audit" className="text-gray-300 hover:text-white">
            Audit
          </Link>
          <form action="/api/super-admin/auth/logout" method="post">
            <button className="text-gray-300 hover:text-white" type="submit">
              Logout
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
