"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const tenantPrefill = useMemo(() => search.get("tenant") ?? "", [search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSlug, setTenantSlug] = useState(tenantPrefill);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, tenantSlug: tenantSlug || undefined }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok || !json.success) {
      setError(json.error?.message ?? "Login failed");
      return;
    }

    if (json.data.user.role === "ADMIN") {
      router.push("/dashboard");
      return;
    }

    router.push(`/store/${json.data.tenant.slug}`);
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-black/20 p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-1 text-sm text-gray-400">JWT session is set in secure HTTP-only cookies.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="Tenant slug (required for customer login)"
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          value={tenantSlug}
          onChange={(e) => setTenantSlug(e.target.value)}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          disabled={loading}
          className="w-full rounded bg-indigo-600 px-3 py-2 font-medium text-white disabled:opacity-60"
          type="submit"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
