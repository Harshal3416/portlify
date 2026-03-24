'use client';

import { useSiteDetails } from "@/app/context/siteContext";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function Contact() {
  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');

  const siteDetails = useSiteDetails();

  const [open, setOpen] = useState(false);
  const [gmailId, setContactEmail] = useState("");
  const [phoneNumber, setContactPhone] = useState("");
  const [alternatePhoneNumber, setAlternateContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instagramURL, setInstagramURL] = useState("");
  const [googleURL, setGoogleURL] = useState("");
  const [justDialLink, setJustDialURL] = useState("");
  const [gmapLink, setGmapLink] = useState("");

  // Get tenantid: from URL params first, then from auth context, then fallback
  const tenantid = tenantidFromUrl;

  useEffect(() => {
    console.log("siteDetails in contact component", siteDetails)

    if (siteDetails) {
      setContactEmail(siteDetails.contactemail || "");
      setContactPhone(siteDetails.contactphone || "");
      setAlternateContactPhone(siteDetails.alternatecontactphone || "");
      setAddress(siteDetails.address || "");
      setInstagramURL(siteDetails.instagramurl || "");
      setGoogleURL(siteDetails.googleurl || "");
      setJustDialURL(siteDetails.justdialurl || "");
      setGmapLink(siteDetails.gmapLink || "");
    }
  }, [siteDetails]);

  const openWhatsapp = () => {
    if (!phoneNumber) return;
    const message = "Hello, I would like to inquire about your products."; // replace with your default message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  const openGmail = () => {
    if (!gmailId) return;
    const subject = "Inquiry about products"; // replace with your default subject
    const body = "Hello, I would like to inquire about your products."; // replace with your default message
    const url = `mailto:${gmailId}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  }

  const openPhoneDialer = (mob: number) => {
    if (!mob) return;
    const phoneNumber = mob; // replace with your phone number
    const url = `tel:${phoneNumber}`;
    window.open(url, "_blank");
  }

  const openLink = (url: string) => {
    if (!url) return;
    window.open(url, "_blank");
  }

  const hasContactData =
  gmailId ||
  phoneNumber ||
  alternatePhoneNumber ||
  address ||
  instagramURL ||
  googleURL ||
  justDialLink;

if (!hasContactData) return null;

return (
  <div className="w-[80%] mx-auto border border-gray-300 rounded-md my-2">
    {/* Header */}
    <div
          className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      onClick={() => setOpen(!open)}
    >
      <span className="font-medium text-lg">Contact Details</span>
      {open ? <FaArrowUp /> : <FaArrowDown />}
    </div>

    {/* Content */}
    {open && (
      <div className="border-t border-gray-200 p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Email */}
        {gmailId && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={openGmail}
          >
            <img src="/gmail.jpg" alt="Email" className="w-8 h-8" />
            <span className="text-sm break-all">{gmailId}</span>
          </div>
        )}

        {/* Phone */}
        {(phoneNumber || alternatePhoneNumber) && (
          <div className="flex items-center gap-3">
            <img src="/phone.jpg" alt="Phone" className="w-8 h-8" />
            <div className="text-sm">
              {phoneNumber && (
                <span
                  className="cursor-pointer"
                  onClick={() => openPhoneDialer(Number(phoneNumber))}
                >
                  {phoneNumber}
                </span>
              )}
              {alternatePhoneNumber && (
                <span
                  className="cursor-pointer ml-2"
                  onClick={() =>
                    openPhoneDialer(Number(alternatePhoneNumber))
                  }
                >
                  | {alternatePhoneNumber}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Address */}
        {address && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => openLink(gmapLink)}
          >
            <img src="/gmap.jpg" alt="Map" className="w-8 h-8" />
            <span className="text-sm">{address}</span>
          </div>
        )}

        {/* WhatsApp */}
        {phoneNumber && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={openWhatsapp}
          >
            <img src="/whatsapp.jpg" alt="Whatsapp" className="w-8 h-8" />
            <span className="text-sm">Chat on WhatsApp</span>
          </div>
        )}

        {/* Social Links */}
        {instagramURL && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => openLink(instagramURL)}
          >
            <img src="/instagram.png" alt="Instagram" className="w-8 h-8" />
            <span className="text-sm">Instagram</span>
          </div>
        )}

        {googleURL && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => openLink(googleURL)}
          >
            <img src="/google.png" alt="Google" className="w-8 h-8" />
            <span className="text-sm">Google</span>
          </div>
        )}

        {justDialLink && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => openLink(justDialLink)}
          >
            <img src="/justDial.png" alt="JustDial" className="w-18 h-8" />
            <span className="text-sm">JustDial</span>
          </div>
        )}
      </div>
    )}
  </div>
);
}