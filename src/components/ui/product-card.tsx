"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { formatPriceFromPaise } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  priceInPaise: number;
  compareAtPriceInPaise?: number;
  imageUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  storeSlug: string;
  inStock?: boolean;
}

export function ProductCard({
  id,
  name,
  description,
  priceInPaise,
  compareAtPriceInPaise,
  imageUrl,
  rating = 0,
  reviewCount = 0,
  storeSlug,
  inStock = true,
}: ProductCardProps) {
  const discount =
    compareAtPriceInPaise && compareAtPriceInPaise > priceInPaise
      ? Math.round(((compareAtPriceInPaise - priceInPaise) / compareAtPriceInPaise) * 100)
      : 0;

  return (
    <Link
      href={`/store/${storeSlug}/product/${id}`}
      className="group relative flex flex-col rounded-2xl bg-[var(--surface-container)] overflow-hidden card-hover ghost-border"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-container-low)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-[var(--outline)]" />
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-[var(--tertiary-container)] px-2.5 py-0.5 text-xs font-bold text-[var(--on-tertiary-container)]">
            {discount}% OFF
          </span>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-[var(--error-container)] px-3 py-1 text-xs font-bold text-[var(--error)]">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-[var(--on-surface)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {name}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-[var(--on-surface-variant)] line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[var(--outline-variant)]"}`}
                />
              ))}
            </div>
            <span className="text-xs text-[var(--on-surface-variant)]">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-base font-bold text-[var(--on-surface)]">
            {formatPriceFromPaise(priceInPaise)}
          </span>
          {compareAtPriceInPaise && compareAtPriceInPaise > priceInPaise && (
            <span className="text-xs text-[var(--outline)] line-through">
              {formatPriceFromPaise(compareAtPriceInPaise)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
