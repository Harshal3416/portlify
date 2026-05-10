"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./ui/Header";
import { FooterComponent } from "./ui/Footercomponent";

/** Paths that ship their own header/footer (e.g. marketing landing). */
const STANDALONE_CHROME_PREFIXES = ["/home"];

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const hideAppChrome = STANDALONE_CHROME_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  return (
    <>
      {!hideAppChrome && <Header />}
      {children}
      {!hideAppChrome && <FooterComponent />}
      {!hideAppChrome && (
        <button type="button" className="fab-whatsapp">
          💬
        </button>
      )}
    </>
  );
}
