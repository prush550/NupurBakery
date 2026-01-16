import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nupur Bakery | Premium Vegetarian Cakes in Bhopal",
  description: "Nupur's Messy Kitchen by Divya 'Nupur' Tiwari - Delicious vegetarian cakes and baked goods in Bhopal. Custom designs, hygienic preparation, and home delivery available.",
  keywords: ["bakery", "cakes", "Bhopal", "vegetarian cakes", "custom cakes", "birthday cakes", "Nupur cakes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
