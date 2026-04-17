import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  Store,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  ShoppingBasket,
  Gamepad2,
} from "lucide-react";
import { getActiveTenants } from "@/lib/data";
import { StoreCard } from "@/components/ui";

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="h-6 w-6" />,
  Shirt: <Shirt className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Dumbbell: <Dumbbell className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  ShoppingBasket: <ShoppingBasket className="h-6 w-6" />,
  Gamepad2: <Gamepad2 className="h-6 w-6" />,
};

const CATEGORIES = [
  { name: "Electronics", icon: "Smartphone", slug: "electronics" },
  { name: "Fashion", icon: "Shirt", slug: "fashion" },
  { name: "Home & Living", icon: "Home", slug: "home-living" },
  { name: "Beauty", icon: "Sparkles", slug: "beauty" },
  { name: "Sports", icon: "Dumbbell", slug: "sports" },
  { name: "Books", icon: "BookOpen", slug: "books" },
  { name: "Grocery", icon: "ShoppingBasket", slug: "grocery" },
  { name: "Toys & Games", icon: "Gamepad2", slug: "toys" },
];

export default async function HomePage() {
  const tenants = await getActiveTenants();

  return (
    <div className="space-y-0">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--surface-container-low)] via-[var(--surface)] to-[var(--surface-container-low)]">
        {/* Decorative Gradient Orbs */}
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[var(--primary-container)] opacity-[0.07] blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[var(--tertiary-container)] opacity-[0.07] blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary-container)]/10 px-4 py-1.5 text-xs font-medium text-[var(--primary)] ghost-border">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 500+ local vendors across India
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-[var(--on-surface)]">Discover Amazing</span>
              <br />
              <span className="text-gradient">Products from</span>
              <br />
              <span className="text-[var(--on-surface)]">Local Vendors</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--on-surface-variant)] sm:text-lg">
              Shop unique products from verified local sellers. Support small businesses, enjoy fast delivery, and experience premium marketplace quality.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/#stores"
                className="btn-primary px-8 py-4 text-base"
              >
                Explore Stores
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="btn-secondary px-8 py-4 text-base"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-[var(--surface-container-low)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-6 sm:justify-between sm:px-6 lg:px-8">
          {[
            { icon: <Shield className="h-5 w-5" />, text: "Secure Payments" },
            { icon: <Truck className="h-5 w-5" />, text: "Fast Delivery" },
            { icon: <Store className="h-5 w-5" />, text: "Verified Vendors" },
            { icon: <Sparkles className="h-5 w-5" />, text: "Quality Products" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm text-[var(--on-surface-variant)]">
              <span className="text-[var(--primary)]">{icon}</span>
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--on-surface)]">
            Shop by Category
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                className="flex flex-col items-center gap-2.5 rounded-2xl bg-[var(--surface-container)] p-4 text-[var(--on-surface-variant)] ghost-border hover:bg-[var(--surface-container-high)] hover:text-[var(--primary)] transition-all duration-200 group"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-container-high)] text-[var(--primary)] group-hover:bg-[var(--primary-container)] group-hover:text-white transition-all">
                  {ICON_MAP[cat.icon]}
                </span>
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Stores ── */}
      <section id="stores" className="bg-[var(--surface-container-low)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--on-surface)]">
                Featured Stores
              </h2>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                Discover curated shops from verified vendors
              </p>
            </div>
          </div>

          {tenants.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-container)] py-16 text-center ghost-border">
              <Store className="h-12 w-12 text-[var(--outline)]" />
              <p className="mt-4 text-sm font-medium text-[var(--on-surface-variant)]">
                No stores available yet
              </p>
              <Link
                href="/register"
                className="btn-primary mt-6"
              >
                Be the first to launch your store
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
              {tenants.map((tenant) => (
                <StoreCard
                  key={tenant.id}
                  slug={tenant.slug}
                  name={tenant.name}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary-container)] via-[var(--secondary-container)] to-[var(--primary-container)] p-10 sm:p-14 text-center">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white opacity-[0.05] blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-[var(--tertiary)] opacity-[0.08] blur-3xl" />
            <div className="relative">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white sm:text-4xl">
                Start Your Online Store Today
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/70 sm:text-base">
                Join hundreds of local vendors who are already selling on StoreBase. Setup takes less than 5 minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="rounded-xl bg-white px-8 py-4 text-base font-bold text-[var(--primary)] shadow-xl shadow-indigo-900/20 hover:bg-white/95 transition-all active:scale-[0.98]"
                >
                  Create Your Store — Free
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl bg-white/10 px-8 py-4 text-base font-bold text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all active:scale-[0.98]"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
