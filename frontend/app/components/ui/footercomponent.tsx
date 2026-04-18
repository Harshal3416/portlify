'use client'

import { useSiteDetails } from "@/app/context/siteContext";

export function FooterComponent() {
    const siteDetails = useSiteDetails().siteDetails;

  const openGmail = () => {
    const subject = "Inquiry about products";
    const body = "Hello, I would like to enquire about your products.";
    const url = `mailto:professor3416@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  };

  const openWhatsapp = () => {
    const phoneNumber = siteDetails?.contactphone || "9909090909";
    const message = "Hello from Raj Wholesale";
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          Contact developer: <button onClick={openGmail}>professor3416@gmail.com</button> · <button onClick={openWhatsapp}>WhatsApp</button>
        </div>
        <div>© {new Date().getFullYear()} {siteDetails?.sitetitle} All rights reserved.</div>
      </div>
    </footer>
  );
}

