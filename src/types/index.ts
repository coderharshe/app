/**
 * Core domain types for the multi-tenant ecommerce platform.
 * All entities are scoped to a store via `storeId` or `store_id` based on Firestore conventions.
 */

export interface Store {
  id: string; // The Firestore document ID
  owner_id?: string; // User ID from Firebase Auth
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  themeColor?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category?: string;
  tags?: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  store_id: string;
  user_id: string; // Customer User ID
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  storeId: string;
}

export interface NavLink {
  label: string;
  href: string;
}
