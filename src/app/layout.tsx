import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/config/brand";
export const metadata: Metadata = {
  title: { default: brand.companyName, template: `%s | ${brand.companyName}` },
  description: "Premium crypto trading pool platform architecture.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
