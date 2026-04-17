import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Navbar, Footer } from "@/components/layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StoreBase — Discover Amazing Products from Local Vendors",
    template: "%s | StoreBase",
  },
  description:
    "StoreBase connects customers with amazing local vendors. Discover unique products, support small businesses, and shop with confidence.",
  keywords: ["ecommerce", "marketplace", "local vendors", "online shopping", "StoreBase"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
