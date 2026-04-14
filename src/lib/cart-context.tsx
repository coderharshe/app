"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types";
import { addItemWithStoreGuard, CartItemState } from "@/lib/cart-utils";

export type CartItem = CartItemState;

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const stored = localStorage.getItem("cart_items");
      if (stored) {
        return JSON.parse(stored) as CartItem[];
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
    return [];
  });

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((currentItems) => {
      const { items: nextItems, blocked } = addItemWithStoreGuard(
        currentItems,
        product,
        quantity
      );

      if (blocked) {
        alert("You cannot add items from different stores to the same cart. Please complete your checkout for the current store or clear your cart first.");
        return currentItems;
      }

      return nextItems;
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.id !== productId);
      }
      return currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
