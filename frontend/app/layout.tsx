import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { FooterComponent } from "./components/ui/footercomponent";
import QueryProvider from "@/providers/QueryProvider";
import { SiteProvider } from "./context/siteContext";
import { ToastProvider } from "./context/ToastContext";
import { ClerkProvider, Show, UserButton } from '@clerk/nextjs'
import AuthInitializer from "./components/ui/AuthInitializer";
import { Header } from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raj Wholesale Stainless Steel Shop",
  description: "Premium stainless steel products wholesale supplier in Bangalore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f9f6f0]`}>
        <SiteProvider>
          <QueryProvider>
            <ToastProvider>
              <ClerkProvider>
                <AuthInitializer />
                <Header />               
                  {children}
                <FooterComponent />
              </ClerkProvider>
            </ToastProvider>
          </QueryProvider>
        </SiteProvider>
        <button className="fab-whatsapp">
          💬
        </button>
      </body>
    </html>
  );
}
