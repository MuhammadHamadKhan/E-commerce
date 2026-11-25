// Main layout: fonts, Providers, then navbar + footer around every page.
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import AppFrame from "@/components/layout/AppFrame";

// Characterful warm serif for headings + clean readable sans for body UI
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Last Bite - Fresh Bakes Saved From Waste in Peshawar",
  description:
    "Every evening, local artisan bakeries in Peshawar sell their fresh surplus treats at 40-60% off. Grab them before closing time and collect in store.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-surface text-on-surface antialiased font-sans overflow-x-clip">
        <Providers>
          <Suspense fallback={<>{children}</>}>
            <AppFrame>{children}</AppFrame>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
