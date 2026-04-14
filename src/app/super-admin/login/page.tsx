"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/super-admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok || !json.success) {
      setError(json.error?.message ?? "Login failed");
      return;
    }

    router.push("/super-admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-black/20 p-6">
      <h1 className="text-2xl font-semibold">Super Admin Login</h1>
      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          placeholder="Owner email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
          placeholder="Password"
          required
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="w-full rounded bg-indigo-600 px-3 py-2 text-white" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
