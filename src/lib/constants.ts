import type { NavLink } from "@/types";

export const PLATFORM_NAME = "StoreBase";
export const PLATFORM_TAGLINE = "Launch your online store in minutes.";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore Stores", href: "/#stores" },
  { label: "Cart", href: "/cart" },
];

export const FOOTER_LINKS = {
  platform: [
    { label: "About Us", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Status", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};
