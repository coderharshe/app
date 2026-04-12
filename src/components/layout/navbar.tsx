"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Store } from "lucide-react";
import { NAV_LINKS, PLATFORM_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 transition-shadow group-hover:shadow-indigo-500/40">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            {PLATFORM_NAME}
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110"
          >
            Open Your Store
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile navigation panel */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "max-h-80 border-t border-white/10" : "max-h-0"
        )}
      >
        <div className="space-y-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 block rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
          >
            Open Your Store
          </Link>
        </div>
      </div>
    </header>
  );
}
