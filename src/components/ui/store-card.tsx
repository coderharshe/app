import Link from "next/link";
import { ArrowRight, Store as StoreIcon } from "lucide-react";
import type { Store } from "@/types";

interface StoreCardProps {
  store: Store;
  productCount: number;
}

export function StoreCard({ store, productCount }: StoreCardProps) {
  return (
    <Link
      href={`/store/${store.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gray-900/50 p-6 transition-all duration-300 hover:border-white/10 hover:bg-gray-900/80 hover:shadow-2xl hover:shadow-indigo-500/5"
    >
      {/* Decorative gradient orb */}
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: store.themeColor }}
      />

      {/* Icon */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${store.themeColor}20` }}
      >
        <StoreIcon
          className="h-6 w-6"
          style={{ color: store.themeColor }}
        />
      </div>

      {/* Name */}
      <h3 className="mt-4 text-lg font-bold text-white transition-colors group-hover:text-indigo-300">
        {store.name}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
        {store.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xs font-medium text-gray-500">
          {productCount} {productCount === 1 ? "product" : "products"}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-400 transition-transform duration-300 group-hover:translate-x-1">
          Visit Store
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
