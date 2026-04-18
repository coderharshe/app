"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Store, Loader2, AlertCircle } from "lucide-react";

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

  const [success, setSuccess] = useState<{ slug: string; name: string } | null>(null);

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
      setSuccess({ slug: json.data.tenant.slug, name: json.data.tenant.name });
      return;
    }

    router.push(`/store/${json.data.tenant.slug}`);
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in-up text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary shadow-lg ring-8 ring-[var(--primary-container)]/20">
            <Store className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[var(--on-surface)] mb-2">
            Store Created!
          </h1>
          <p className="text-[var(--on-surface-variant)] mb-8">
            Congratulations! <strong>{success.name}</strong> is now live on StoreBase.
          </p>
          
          <div className="bg-[var(--surface-container)] rounded-2xl p-6 mb-8 ghost-border text-left">
            <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2">Store URL</p>
            <div className="flex items-center justify-between bg-[var(--surface-container-lowest)] p-3 rounded-xl ghost-border mb-4">
              <code className="text-sm font-semibold truncate text-[var(--on-surface)]">
                {window.location.origin}/store/{success.slug}
              </code>
            </div>
            <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
              Your dashboard is ready. Let's set up your products and start selling.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary w-full py-4 text-lg font-bold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[var(--on-surface)]">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
            Join StoreBase as a vendor or customer
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[var(--surface-container)] p-6 sm:p-8 ghost-border">
          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-[var(--surface-container-lowest)] p-1 mb-6">
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === "ADMIN"
                  ? "gradient-primary text-white shadow"
                  : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
              }`}
              onClick={() => setMode("ADMIN")}
              type="button"
            >
              <Store className="h-4 w-4" />
              Vendor
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === "CUSTOMER"
                  ? "gradient-primary text-white shadow"
                  : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
              }`}
              onClick={() => setMode("CUSTOMER")}
              type="button"
            >
              <User className="h-4 w-4" />
              Customer
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                <User className="h-3.5 w-3.5" /> Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                <Mail className="h-3.5 w-3.5" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                <Lock className="h-3.5 w-3.5" /> Password
              </label>
              <input
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
              />
            </div>

            {/* Conditional Field */}
            {mode === "ADMIN" ? (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                  <Store className="h-3.5 w-3.5" /> Store Name
                </label>
                <input
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                  placeholder="Your store name (e.g., Luxe Vision)"
                  className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
                  <Store className="h-3.5 w-3.5" /> Store Identifier
                </label>
                <input
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  required
                  placeholder="Enter the store slug to shop at"
                  className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-[var(--error-container)]/20 p-3 text-xs text-[var(--error)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              className="btn-primary w-full mt-2"
              type="submit"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : mode === "ADMIN" ? (
                "Launch Your Store"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-[var(--on-surface-variant)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
