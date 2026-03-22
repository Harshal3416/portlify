'use client'

import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function FooterComponent() {

  const phoneNumber = 1234;

  const openGmail = () => {
    const subject = "Inquiry about products"; // replace with your default subject
    const body = "Hello, I would like to inquire about your products."; // replace with your default message
    const url = `mailto:${process.env.DEVELOPER_EMAIL_ID}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  }

  const openWhatsapp = () => {
    if(!phoneNumber) return;
    const message = "Hello, I would like to inquire about your products."; // replace with your default message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <footer className="fixed bottom-0 left-0 w-full border-t bg-card bg-white">
      {/* Floating WhatsApp button */}
      <span
        className="fixed bottom-4 right-4 border border-gray-300 shadow-lg rounded-full p-2 flex justify-center items-center cursor-pointer"
        onClick={openWhatsapp}
      >
        <img
          src="/whatsapp.jpg"
          alt="Whatsapp Icon"
          className="w-10 h-10 inline-block"
        />
      </span>

      {/* Footer content */}
      <div className="mt-2 pt-2 text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-center my-2 gap-2">
          <div>Contact developer over&nbsp;</div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-4 w-4" />
            <span className="truncate cursor-pointer" onClick={openGmail}>
              professor3416@gmail.com /
            </span>
            <FaWhatsapp className="cursor-pointer" />
            <span onClick={openWhatsapp}>Whatsapp</span>
          </div>
        </div>

        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
