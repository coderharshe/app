import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-container)]">
        <SearchX className="h-10 w-10 text-[var(--outline)]" />
      </div>
      <h2 className="mt-6 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[var(--on-surface)]">
        Page Not Found
      </h2>
      <p className="mt-3 max-w-md text-center text-sm text-[var(--on-surface-variant)]">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--surface-container)] px-6 py-3 text-sm font-semibold text-[var(--on-surface)] ghost-border hover:bg-[var(--surface-container-high)] transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
