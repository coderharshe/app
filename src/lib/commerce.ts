import { ApiError } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export type CheckoutItem = {
  productId: string;
  quantity: number;
};

export async function getProductsForCheckout(tenantId: string, items: CheckoutItem[]) {
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      tenant_id: tenantId,
      id: { in: productIds },
      is_active: true,
    },
  });

  if (products.length !== items.length) {
    throw new ApiError(400, "One or more products are unavailable");
  }

  const itemMap = new Map(items.map((item) => [item.productId, item.quantity]));

  return products.map((product) => {
    const quantity = itemMap.get(product.id) ?? 0;
    if (product.inventory < quantity) {
      throw new ApiError(400, `${product.name} has insufficient inventory`);
    }

    return {
      product,
      quantity,
      lineTotalPaise: quantity * product.price_in_paise,
    };
  });
}

export function toCartJson(items: CheckoutItem[]) {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}
