import type { NavLink } from "@/types";

export const PLATFORM_NAME = "StoreBase";
export const PLATFORM_TAGLINE = "Your marketplace, your rules. Launch your online store in minutes.";
export const PLATFORM_DESCRIPTION = "StoreBase connects customers with amazing local vendors. Discover unique products, support small businesses, and shop with confidence.";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Stores", href: "/#stores" },
];

export const CATEGORIES = [
  { name: "Electronics", icon: "Smartphone", slug: "electronics" },
  { name: "Fashion", icon: "Shirt", slug: "fashion" },
  { name: "Home & Living", icon: "Home", slug: "home-living" },
  { name: "Beauty", icon: "Sparkles", slug: "beauty" },
  { name: "Sports", icon: "Dumbbell", slug: "sports" },
  { name: "Books", icon: "BookOpen", slug: "books" },
  { name: "Grocery", icon: "ShoppingBasket", slug: "grocery" },
  { name: "Toys", icon: "Gamepad2", slug: "toys" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { label: "About Us", href: "#" },
    { label: "Sell on StoreBase", href: "/register" },
    { label: "Pricing", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns & Refunds", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Vendor Agreement", href: "#" },
  ],
};

export const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  PROCESSING: { label: "Processing", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  PAID: { label: "Paid", color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
  SHIPPED: { label: "Shipped", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
  DELIVERED: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  CANCELLED: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
} as const;
