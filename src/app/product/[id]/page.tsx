export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getProductById, getStoreById } from "@/lib/firebase/queries";
import AddToCartButton from "./add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description?.slice(0, 155),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // 1. Fetch Product
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  // 2. Fetch Store connected to product
  const store = await getStoreById(product.store_id);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back navigation */}
      {store && (
        <Link
          href={`/store/${store.slug}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {store.name}
        </Link>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── Image Column ──────────────────────────────────── */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-gray-900/50">
          {product.images?.[0] ? (
            <img 
               src={product.images[0]} 
               alt={product.name} 
               className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
            />
          ) : (
             <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
               <ShoppingBag className="h-24 w-24 text-gray-700" />
             </div>
          )}

          {hasDiscount && (
            <span className="absolute left-4 top-4 rounded-full bg-rose-500/90 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* ── Details Column ────────────────────────────────── */}
        <div className="flex flex-col">
          {/* Store link */}
          {store && (
            <Link
              href={`/store/${store.slug}`}
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {store.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl text-shadow-lg">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-700 text-gray-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {product.rating || 5.0} ({product.reviewCount || Math.floor(Math.random() * 100) + 1} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-white">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                Save {formatPrice(product.compareAtPrice! - product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-sm leading-relaxed text-gray-300">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-gray-400"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          {/* Trust badges */}
          <div className="mt-10 grid grid-cols-3 gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders over ₹999" },
              { icon: Shield, label: "Secure Payment", sub: "SSL Encrypted" },
              { icon: RotateCcw, label: "Easy Returns", sub: "7-day policy" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <badge.icon className="h-6 w-6 text-gray-400" />
                <span className="text-xs font-semibold text-gray-200">
                  {badge.label}
                </span>
                <span className="text-[10px] text-gray-500">{badge.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
