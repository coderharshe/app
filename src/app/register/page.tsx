"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterContent() {
  const router = useRouter();
  const search = useSearchParams();
  const modeParam = search.get("mode");
  const tenantParam = search.get("tenant");

  const [mode, setMode] = useState<"ADMIN" | "CUSTOMER">(
    modeParam === "customer" ? "CUSTOMER" : "ADMIN"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSlug, setTenantSlug] = useState(tenantParam ?? "");
  const [tenantName, setTenantName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role: mode,
        tenantSlug: mode === "CUSTOMER" ? tenantSlug : undefined,
        tenantName: mode === "ADMIN" ? tenantName : undefined,
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok || !json.success) {
      setError(json.error?.message ?? "Registration failed");
      return;
    }

    if (mode === "ADMIN") {
      router.push("/dashboard");
      return;
    }

    router.push(`/store/${json.data.tenant.slug}`);
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-black/20 p-6">
      <h1 className="text-2xl font-semibold">Register</h1>
      <p className="mt-1 text-sm text-gray-400">Create an admin or customer account.</p>

      <div className="mt-4 flex gap-2 text-sm">
        <button
          className={`rounded px-3 py-1.5 ${mode === "ADMIN" ? "bg-indigo-600" : "bg-white/10"}`}
          onClick={() => setMode("ADMIN")}
          type="button"
        >
          Store Owner
        </button>
        <button
          className={`rounded px-3 py-1.5 ${mode === "CUSTOMER" ? "bg-indigo-600" : "bg-white/10"}`}
          onClick={() => setMode("CUSTOMER")}
          type="button"
        >
          Customer
        </button>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          placeholder="Password"
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {mode === "ADMIN" ? (
          <input
            className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
            placeholder="Store name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />
        ) : (
          <input
            className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
            placeholder="Store slug"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            required
          />
        )}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          disabled={loading}
          className="w-full rounded bg-indigo-600 px-3 py-2 font-medium text-white disabled:opacity-60"
          type="submit"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8 text-neutral-400">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
