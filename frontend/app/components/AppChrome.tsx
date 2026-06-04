"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./ui/Header";
import { FooterComponent } from "./ui/Footercomponent";
import { useSiteDetails } from "@/app/context/siteContext";

/** Paths that ship their own header/footer (e.g. marketing landing). */
const STANDALONE_CHROME_PREFIXES = ["/home"];

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const { siteDetails } = useSiteDetails();
  const hideAppChrome = STANDALONE_CHROME_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const contactNumber = siteDetails?.contactphone || siteDetails?.alternatecontactphone;

  const openWhatsApp = () => {
    if (!contactNumber) return;
    const phone = contactNumber.replace(/[^0-9]/g, "");
    const businessName = siteDetails?.sitetitle ? ` for ${siteDetails.sitetitle}` : "";
    const message = `Hello, I would like to enquire about your business${businessName}. I got to know about your business through Catalogr application.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {!hideAppChrome && <Header />}
      {children}
      {!hideAppChrome && <FooterComponent />}
      {!hideAppChrome && contactNumber && (
        <button type="button" className="fab-whatsapp" onClick={openWhatsApp}>
          💬
        </button>
      )}
    </>
  );
}
