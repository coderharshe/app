import Link from "next/link";
import { Store, Mail, MapPin, Phone } from "lucide-react";
import { PLATFORM_NAME, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--surface-container-lowest)]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold font-[family-name:var(--font-heading)] text-[var(--on-surface)]">
                {PLATFORM_NAME}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[var(--on-surface-variant)]">
              Empowering local vendors to reach customers online. Your marketplace, your rules.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--on-surface-variant)]">
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> support@storebase.in
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> +91 98765 43210
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> India
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--on-surface)]">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--on-surface)]">
              Support
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--on-surface)]">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[var(--surface-container-low)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[var(--outline)]">
            © {currentYear} {PLATFORM_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--outline)]">
            Made with ❤️ for local vendors across India
          </p>
        </div>
      </div>
    </footer>
  );
}
