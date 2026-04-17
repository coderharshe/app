import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a paise value (integer) as Indian Rupee currency.
 * Prisma stores prices in paise (e.g., 59900 = ₹599).
 *
 * @param paise - The price in paise (integer)
 * @returns Formatted string like "₹599" or "₹1,299"
 */
export function formatPriceFromPaise(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Formats a rupee value (number) as Indian Rupee currency.
 * Firebase stores prices directly in rupees (e.g., 599 = ₹599).
 *
 * @param rupees - The price in rupees (number)
 * @returns Formatted string like "₹599" or "₹1,299"
 */
export function formatPriceFromRupees(rupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Legacy formatPrice — now routes to formatPriceFromRupees.
 * Kept for backward compatibility.
 *
 * @param price - The price in rupees
 * @param _currency - Ignored, always INR
 * @returns Formatted string like "₹599"
 */
export function formatPrice(price: number, _currency?: string): string {
  return formatPriceFromRupees(price);
}

/**
 * Converts rupees to paise for storage in Prisma.
 * @param rupees - The price in rupees
 * @returns The price in paise (integer)
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Converts paise to rupees for display.
 * @param paise - The price in paise
 * @returns The price in rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Truncates a string to a given length with ellipsis.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "...";
}

/**
 * Generates star display info from a numeric rating.
 */
export function getStarRating(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

/**
 * Returns a relative time string (e.g., "2 hours ago").
 */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diffMs = now - past;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}
