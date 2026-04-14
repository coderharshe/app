"use client";

import Link from "next/link";
import { ShoppingCart, Store } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Store className="h-5 w-5" />
          <span className="font-semibold">StoreBase</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/register" className="text-gray-300 hover:text-white">
            Register
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/cart" className="text-gray-300 hover:text-white" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
