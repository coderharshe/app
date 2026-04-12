import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";

import { PLATFORM_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
              <Zap className="h-3.5 w-3.5" />
              Multi-tenant ecommerce, simplified
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Launch your store{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                in minutes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {PLATFORM_NAME} gives every merchant a powerful, independent
              storefront on a shared, scalable platform — no code required.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#stores"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110"
              >
                Explore Stores
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-gray-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Create Your Store
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-gray-950/50">
        <div className="mx-auto grid max-w-7xl gap-px sm:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Built on Next.js with edge rendering for instant page loads.",
            },
            {
              icon: Shield,
              title: "Secure by Default",
              description: "Row-level security ensures complete tenant data isolation.",
            },
            {
              icon: Globe,
              title: "India-First Payments",
              description: "Razorpay integration for UPI, cards, wallets, and net banking.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-3 border-white/5 px-6 py-10 text-center sm:border-r last:border-r-0"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                <feature.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {feature.title}
              </h3>
              <p className="max-w-xs text-sm text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>


    </>
  );
}
