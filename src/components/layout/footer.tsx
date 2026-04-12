import Link from "next/link";
import { Store } from "lucide-react";
import { PLATFORM_NAME, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {PLATFORM_NAME}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              The modern multi-tenant ecommerce platform. Launch, manage, and
              scale your online store with ease.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Platform
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} {PLATFORM_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built for scale. Designed for India.
          </p>
        </div>
      </div>
    </footer>
  );
}
