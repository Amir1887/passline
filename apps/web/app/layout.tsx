import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Passline: AI front desk for restaurants",
  description:
    "Portfolio demo by Amir Gad. An MCP server any AI assistant can use: opening hours, table availability, menu search, allergen checks and a floor-plan image. Fictional data.",
  authors: [{ name: "Amir Gad" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
