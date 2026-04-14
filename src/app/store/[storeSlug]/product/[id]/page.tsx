import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart";
import { getProductByIdAndTenant } from "@/lib/data";

interface Props {
  params: Promise<{ storeSlug: string; id: string }>;
}

export default async function TenantProductPage({ params }: Props) {
  const { storeSlug, id } = await params;
  const product = await getProductByIdAndTenant(id, storeSlug);

  if (!product || product.tenant.slug !== storeSlug) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Link href={`/store/${storeSlug}`} className="text-sm text-gray-300 hover:text-white">
        Back to store
      </Link>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="max-w-2xl text-gray-300">{product.description}</p>
      <p className="text-lg font-semibold">INR {(product.price_in_paise / 100).toFixed(2)}</p>
      <AddToCartButton tenantSlug={storeSlug} productId={product.id} />
    </div>
  );
}
