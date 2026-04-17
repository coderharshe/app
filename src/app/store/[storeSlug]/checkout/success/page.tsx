import Link from "next/link";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";

interface Props {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { storeSlug } = await params;
  const { order } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center animate-fade-in-up">
        {/* Checkmark */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>

        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[var(--on-surface)]">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {order && (
          <div className="mt-6 rounded-xl bg-[var(--surface-container)] p-4 ghost-border">
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--on-surface-variant)]">
              <Package className="h-4 w-4" />
              Order ID
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--primary)]">
              {order}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/store/${storeSlug}`}
            className="btn-primary"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
