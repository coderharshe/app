import Link from "next/link";

export default function CartPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Tenant Cart</h1>
      <p className="text-sm text-gray-300">
        Use path-based cart route: <code>/store/&lt;tenant-slug&gt;/cart</code>.
      </p>
      <Link href="/" className="rounded bg-white/10 px-3 py-2 text-sm">
        Browse stores
      </Link>
    </div>
  );
}
