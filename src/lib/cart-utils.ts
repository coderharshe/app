import { Product } from "@/types";

export interface CartItemState extends Product {
  quantity: number;
}

export function addItemWithStoreGuard(
  currentItems: CartItemState[],
  product: Product,
  quantity = 1
): { items: CartItemState[]; blocked: boolean } {
  if (currentItems.length > 0 && currentItems[0].store_id !== product.store_id) {
    return { items: currentItems, blocked: true };
  }

  const existing = currentItems.find((item) => item.id === product.id);
  if (existing) {
    return {
      blocked: false,
      items: currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ),
    };
  }

  return { blocked: false, items: [...currentItems, { ...product, quantity }] };
}
