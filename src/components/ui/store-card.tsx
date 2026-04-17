import Link from "next/link";
import { Store, Star, ArrowRight } from "lucide-react";

interface StoreCardProps {
  slug: string;
  name: string;
  description?: string;
  productCount?: number;
  rating?: number;
}

export function StoreCard({
  slug,
  name,
  description,
  productCount = 0,
  rating = 0,
}: StoreCardProps) {
  return (
    <Link
      href={`/store/${slug}`}
      className="group relative flex flex-col rounded-2xl bg-[var(--surface-container)] overflow-hidden card-hover ghost-border"
    >
      {/* Gradient Header */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[var(--primary-container)] via-[var(--secondary-container)] to-[var(--surface-container)]">
        {/* Decorative Orbs */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--primary)] opacity-10 blur-xl" />
        <div className="absolute -left-4 bottom-0 h-16 w-16 rounded-full bg-[var(--tertiary)] opacity-10 blur-xl" />
        
        {/* Store Icon */}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-container)] ghost-border shadow-lg">
            <Store className="h-6 w-6 text-[var(--primary)]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 pt-8">
        <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
          {name}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-[var(--on-surface-variant)] line-clamp-2">
            {description}
          </p>
        )}

        {/* Stats Row */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-[var(--on-surface-variant)]">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
            {productCount > 0 && (
              <span className="text-xs text-[var(--on-surface-variant)]">
                {productCount} products
              </span>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--outline)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
