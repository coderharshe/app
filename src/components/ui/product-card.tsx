import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gray-900/50 transition-all duration-300 hover:border-white/10 hover:bg-gray-900/80 hover:shadow-2xl hover:shadow-indigo-500/5"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-gray-800/50">
        {/* Placeholder gradient — will be replaced with real images */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <ShoppingBag className="h-12 w-12 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm">
            <span className="rounded-full border border-white/20 bg-gray-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="mt-1.5 text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-300">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-600">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className={cn("text-base font-bold", product.inStock ? "text-white" : "text-gray-500")}>
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
