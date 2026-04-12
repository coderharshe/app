import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar, Footer } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StoreBase — Launch Your Online Store",
    template: "%s | StoreBase",
  },
  description:
    "The modern multi-tenant ecommerce platform. Launch, manage, and scale your online store in minutes.",
  keywords: [
    "ecommerce",
    "online store",
    "multi-tenant",
    "saas",
    "india",
    "razorpay",
  ],
};

import { CartProvider } from "@/lib/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
