"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!product.inStock || added}
      className={`flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white shadow-xl transition-all sm:w-auto duration-300
        ${
          !product.inStock
            ? "bg-gray-800 text-gray-500 cursor-not-allowed shadow-none"
            : added
            ? "bg-emerald-500 hover:brightness-105 shadow-emerald-500/25"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/40 hover:brightness-110"
        }
      `}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </>
      )}
    </button>
  );
}
