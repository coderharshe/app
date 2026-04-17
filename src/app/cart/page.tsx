import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function CartPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center animate-fade-in-up">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-container)]">
          <ShoppingCart className="h-10 w-10 text-[var(--outline)]" />
        </div>

        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[var(--on-surface)]">
          Store Cart
        </h1>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
          Your cart is specific to each store. Browse a store and add products to get started.
        </p>

        <Link
          href="/"
          className="btn-primary mt-8"
        >
          Browse Stores
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
