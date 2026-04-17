"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingCart,
  Store,
  Search,
  User,
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { PLATFORM_NAME } from "@/lib/constants";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary transition-transform duration-300 group-hover:scale-105">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold font-[family-name:var(--font-heading)] tracking-tight text-[var(--on-surface)]">
            {PLATFORM_NAME}
          </span>
        </Link>

        {/* Search Bar — Desktop */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--on-surface-variant)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, stores..."
              className="w-full rounded-xl bg-[var(--surface-container-lowest)] py-2.5 pl-10 pr-4 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--primary-container)] ghost-border"
            />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className="btn-ghost px-4 py-2"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="btn-ghost px-4 py-2"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
          <Link
            href="/register"
            className="btn-primary px-5 py-2 text-sm"
          >
            <UserPlus className="h-4 w-4" />
            Register
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary px-4 py-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/cart"
            className="ml-2 relative flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--surface-container)] ghost-border hover:bg-[var(--surface-container-high)] transition-all duration-200"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5 text-[var(--on-surface-variant)] group-hover:text-[var(--primary)]" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden ml-auto flex items-center justify-center h-10 w-10 rounded-xl hover:bg-[var(--surface-container)] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-[var(--on-surface)]" />
          ) : (
            <Menu className="h-5 w-5 text-[var(--on-surface)]" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass animate-fade-in">
          {/* Mobile Search */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--on-surface-variant)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, stores..."
                className="w-full rounded-xl bg-[var(--surface-container-lowest)] py-2.5 pl-10 pr-4 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border"
              />
            </div>
          </div>
          <div className="flex flex-col px-2 pb-4 space-y-0.5">
            {[
              { href: "/", label: "Home", icon: Store },
              { href: "/login", label: "Login", icon: LogIn },
              { href: "/register", label: "Register", icon: UserPlus },
              { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
              { href: "/cart", label: "Cart", icon: ShoppingCart },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] rounded-xl hover:bg-[var(--surface-container)] transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
