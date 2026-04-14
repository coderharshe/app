import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart";
import { getProductByIdAndTenant } from "@/lib/data";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductByIdAndTenant(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Link href={`/store/${product.tenant.slug}`} className="text-sm text-gray-300 hover:text-white">
        Back to {product.tenant.name}
      </Link>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-300">{product.description}</p>
      <p className="text-lg font-semibold">INR {(product.price_in_paise / 100).toFixed(2)}</p>
      <AddToCartButton tenantSlug={product.tenant.slug} productId={product.id} />
    </div>
  );
}
