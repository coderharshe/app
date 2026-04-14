"use client";

import { AddToCartButton } from "@/components/cart/add-to-cart";

export default function LegacyAddToCartButton({
  productId,
  tenantSlug,
}: {
  productId: string;
  tenantSlug: string;
}) {
  return <AddToCartButton productId={productId} tenantSlug={tenantSlug} />;
}
