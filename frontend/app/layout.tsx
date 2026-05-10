import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { SiteProvider } from "./context/siteContext";
import { ToastProvider } from "./context/ToastContext";
import { ClerkProvider, Show, UserButton } from '@clerk/nextjs'
import AuthInitializer from "./components/ui/AuthInitializer";
import AppChrome from "./components/AppChrome";
import { Suspense } from "react";
import { Playfair_Display, DM_Sans } from 'next/font/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catalogr — Create Your Free Business Showcase",
  description:
    "Catalogr lets any business — shop, broker, bakery, guest lodge — build a stunning digital product catalog and share it with customers in minutes. Free, forever.",
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

function SiteProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SiteProvider>
        {children}
      </SiteProvider>
    </Suspense>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable}`}>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#f9f6f0] bg-cream text-steel-dark overflow-x-hidden antialiased` }>
        <SiteProviderWrapper>
          <QueryProvider>
            <ToastProvider>
              <ClerkProvider>
                <AuthInitializer />
                <AppChrome>{children}</AppChrome>
              </ClerkProvider>
            </ToastProvider>
          </QueryProvider>
        </SiteProviderWrapper>
      </body>
    </html>
  );
}
