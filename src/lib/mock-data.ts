import type { Store, Product } from "@/types";

/**
 * Mock data for development. Will be replaced with Firebase queries.
 * All data mimics the production schema so the migration is seamless.
 */

export const MOCK_STORES: Store[] = [
  {
    id: "store-1",
    slug: "urban-threads",
    name: "Urban Threads",
    description:
      "Premium streetwear and contemporary fashion for the modern urbanite. Curated collections that blend comfort with cutting-edge design.",
    logoUrl: "",
    bannerUrl: "",
    themeColor: "#6366f1",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "store-2",
    slug: "tech-haven",
    name: "Tech Haven",
    description:
      "Your one-stop destination for gadgets, accessories, and everything tech. From flagship phones to smart home essentials.",
    logoUrl: "",
    bannerUrl: "",
    themeColor: "#06b6d4",
    createdAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "store-3",
    slug: "artisan-home",
    name: "Artisan Home",
    description:
      "Handcrafted home decor and furniture pieces that bring warmth and character to any space. Every piece tells a story.",
    logoUrl: "",
    bannerUrl: "",
    themeColor: "#f59e0b",
    createdAt: "2025-03-10T10:00:00Z",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // Urban Threads products
  {
    id: "prod-1",
    store_id: "store-1",
    name: "Midnight Noir Hoodie",
    slug: "midnight-noir-hoodie",
    description:
      "A premium heavyweight hoodie in deep black with subtle tonal embroidery. Crafted from 400 GSM organic cotton with a brushed fleece interior for ultimate comfort. Features kangaroo pocket, ribbed cuffs, and an oversized relaxed fit.",
    price: 3499,
    compareAtPrice: 4999,
    currency: "INR",
    images: ["/products/hoodie-1.jpg"],
    category: "Hoodies",
    tags: ["streetwear", "winter", "premium"],
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    createdAt: "2025-04-01T10:00:00Z",
  },
  {
    id: "prod-2",
    store_id: "store-1",
    name: "Vintage Wash Denim Jacket",
    slug: "vintage-wash-denim-jacket",
    description:
      "Classic denim jacket with a modern vintage acid wash finish. Features brass button closures, dual chest pockets, and adjustable waist tabs. Made from premium selvedge denim that ages beautifully.",
    price: 4299,
    currency: "INR",
    images: ["/products/denim-1.jpg"],
    category: "Jackets",
    tags: ["denim", "vintage", "streetwear"],
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    createdAt: "2025-04-02T10:00:00Z",
  },
  {
    id: "prod-3",
    store_id: "store-1",
    name: "Minimal Logo Tee — Bone White",
    slug: "minimal-logo-tee-bone-white",
    description:
      "Our signature oversized tee in bone white featuring a minimal chest logo. Premium 250 GSM cotton, drop shoulders, and a boxy silhouette. The perfect essential for layering or wearing solo.",
    price: 1299,
    compareAtPrice: 1799,
    currency: "INR",
    images: ["/products/tee-1.jpg"],
    category: "T-Shirts",
    tags: ["basics", "minimal", "essentials"],
    inStock: true,
    rating: 4.9,
    reviewCount: 312,
    createdAt: "2025-04-03T10:00:00Z",
  },
  {
    id: "prod-4",
    store_id: "store-1",
    name: "Tech Cargo Pants — Olive",
    slug: "tech-cargo-pants-olive",
    description:
      "Functional cargo pants with a modern tapered fit. Features 6 pockets, adjustable ankle cuffs with snap buttons, and water-resistant ripstop fabric. Built for both urban adventures and casual outings.",
    price: 2999,
    currency: "INR",
    images: ["/products/cargo-1.jpg"],
    category: "Pants",
    tags: ["techwear", "cargo", "functional"],
    inStock: false,
    rating: 4.7,
    reviewCount: 56,
    createdAt: "2025-04-04T10:00:00Z",
  },

  // Tech Haven products
  {
    id: "prod-5",
    store_id: "store-2",
    name: "ProBuds ANC Wireless Earbuds",
    slug: "probuds-anc-wireless-earbuds",
    description:
      "True wireless earbuds with hybrid Active Noise Cancellation, 40dB noise reduction, 36-hour battery life with case, and IPX5 water resistance. Bluetooth 5.3 with multipoint connectivity.",
    price: 4999,
    compareAtPrice: 6999,
    currency: "INR",
    images: ["/products/earbuds-1.jpg"],
    category: "Audio",
    tags: ["wireless", "anc", "audio"],
    inStock: true,
    rating: 4.5,
    reviewCount: 234,
    createdAt: "2025-04-05T10:00:00Z",
  },
  {
    id: "prod-6",
    store_id: "store-2",
    name: "UltraCharge 65W GaN Charger",
    slug: "ultracharge-65w-gan-charger",
    description:
      "Compact 65W GaN charger with 3 ports (2x USB-C, 1x USB-A). PD 3.0 and QC 5.0 compatible. Charges a laptop and phone simultaneously. Travel-friendly foldable plug design.",
    price: 2499,
    currency: "INR",
    images: ["/products/charger-1.jpg"],
    category: "Accessories",
    tags: ["charging", "usb-c", "gan"],
    inStock: true,
    rating: 4.7,
    reviewCount: 178,
    createdAt: "2025-04-06T10:00:00Z",
  },
  {
    id: "prod-7",
    store_id: "store-2",
    name: "MechBoard TKL Keyboard",
    slug: "mechboard-tkl-keyboard",
    description:
      "Tenkeyless mechanical keyboard with hot-swappable Gateron switches, per-key RGB lighting, PBT double-shot keycaps, and a solid aluminum frame. Supports wired, Bluetooth, and 2.4GHz connectivity.",
    price: 7999,
    compareAtPrice: 9999,
    currency: "INR",
    images: ["/products/keyboard-1.jpg"],
    category: "Peripherals",
    tags: ["mechanical", "keyboard", "rgb"],
    inStock: true,
    rating: 4.8,
    reviewCount: 92,
    createdAt: "2025-04-07T10:00:00Z",
  },

  // Artisan Home products
  {
    id: "prod-8",
    store_id: "store-3",
    name: "Handwoven Jute Pendant Lamp",
    slug: "handwoven-jute-pendant-lamp",
    description:
      "A stunning pendant light handwoven by artisans using natural jute rope. Casts beautiful shadow patterns on walls. Includes a 1.5m adjustable cord and ceiling plate. Works with E27 bulbs up to 60W.",
    price: 3299,
    currency: "INR",
    images: ["/products/lamp-1.jpg"],
    category: "Lighting",
    tags: ["handmade", "natural", "boho"],
    inStock: true,
    rating: 4.9,
    reviewCount: 67,
    createdAt: "2025-04-08T10:00:00Z",
  },
  {
    id: "prod-9",
    store_id: "store-3",
    name: "Terrazzo Coffee Table",
    slug: "terrazzo-coffee-table",
    description:
      "A modern coffee table with a genuine terrazzo top and powder-coated steel legs. Dimensions: 90cm x 50cm x 40cm. Weight: 18kg. Each piece features a unique pattern of embedded marble chips.",
    price: 12999,
    compareAtPrice: 15999,
    currency: "INR",
    images: ["/products/table-1.jpg"],
    category: "Furniture",
    tags: ["terrazzo", "modern", "living-room"],
    inStock: true,
    rating: 4.6,
    reviewCount: 34,
    createdAt: "2025-04-09T10:00:00Z",
  },
];

/** Find a store by its URL slug */
export function getStoreBySlug(slug: string): Store | undefined {
  return MOCK_STORES.find((s) => s.slug === slug);
}

/** Get all products belonging to a specific store */
export function getProductsByStoreId(store_id: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.store_id === store_id);
}

/** Find a single product by its ID */
export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

/** Get the store that owns a specific product */
export function getStoreForProduct(productId: string): Store | undefined {
  const product = getProductById(productId);
  if (!product) return undefined;
  return MOCK_STORES.find((s) => s.id === product.store_id);
}
