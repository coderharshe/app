import assert from "node:assert/strict";
import { addItemWithStoreGuard, CartItemState } from "../src/lib/cart-utils";
import { Product } from "../src/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    store_id: "s1",
    name: "Demo Product",
    slug: "demo-product",
    description: "desc",
    price: 1000,
    currency: "INR",
    images: [],
    inStock: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function runCartUtilsTests() {
  const product = makeProduct();
  const firstAdd = addItemWithStoreGuard([], product, 1);
  assert.equal(firstAdd.blocked, false);
  assert.equal(firstAdd.items.length, 1);
  assert.equal(firstAdd.items[0].quantity, 1);

  const current: CartItemState[] = [{ ...product, quantity: 1 }];
  const incremented = addItemWithStoreGuard(current, product, 2);
  assert.equal(incremented.blocked, false);
  assert.equal(incremented.items[0].quantity, 3);

  const existingProduct = makeProduct({ id: "p1", store_id: "store-a" });
  const incomingProduct = makeProduct({ id: "p2", store_id: "store-b" });
  const mixedStoreCurrent: CartItemState[] = [{ ...existingProduct, quantity: 1 }];
  const blocked = addItemWithStoreGuard(mixedStoreCurrent, incomingProduct, 1);
  assert.equal(blocked.blocked, true);
  assert.deepEqual(blocked.items, mixedStoreCurrent);
}
