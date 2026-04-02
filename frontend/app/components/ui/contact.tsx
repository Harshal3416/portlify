'use client';

import { useSiteDetails } from "@/app/context/siteContext";
import { useEffect, useState } from "react";
// import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function Contact() {
  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');

  const siteDetails = useSiteDetails();

  // const [open, setOpen] = useState(false);
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

  const openPhoneDialer = (mob: string) => {
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
    <div className="card">
      {/* Header */}
      <div className="custom-card-header">
        <div className="card-title mb-0">
          <div className="card-title-icon">📞</div>
          Contact Details
        </div>
      </div>

      {/* Content */}
      <div className="card-body" style={{ padding: '16px 24px' }}>
        <div className="contact-list">
          {/* Email */}
          {gmailId && (
            <button className="contact-item" onClick={openGmail}>
              <div className="contact-icon mail">
                <img src="/gmail.jpg" alt="" className="w-6 h-6" />
              </div>
              <div>
                <div className="contact-text">{gmailId}</div>
                <div className="contact-sub">Email us anytime</div>
              </div>
            </button>
          )}

          {/* Phone */}
          {(phoneNumber || alternatePhoneNumber) && (
            <button className="contact-item" onClick={() => openPhoneDialer(phoneNumber || alternatePhoneNumber)}>
              <div className="contact-icon phone">
                <img src="/phone.jpg" alt="" className="w-6 h-6" />
              </div>
              <div>
                <div className="contact-text">{phoneNumber}{alternatePhoneNumber && ` | ${alternatePhoneNumber}`}</div>
                <div className="contact-sub">Call or WhatsApp</div>
              </div>
            </button>
          )}

          {/* Address */}
          {address && (
            <button className="contact-item" onClick={() => openLink(gmapLink)}>
              <div className="contact-icon location">
                <img src="/gmap.jpg" alt="" className="w-6 h-6" />
              </div>
              <div>
                <div className="contact-text">{address}</div>
                <div className="contact-sub">Bangalore – 590067</div>
              </div>
            </button>
          )}

          {/* WhatsApp */}
          {phoneNumber && (
            <button className="contact-item" onClick={openWhatsapp}>
              <div className="contact-icon whatsapp">💬</div>
              <div>
                <div className="contact-text">Chat on WhatsApp</div>
                <div className="contact-sub">Quick response</div>
              </div>
            </button>
          )}

          {/* Social Links */}
          {instagramURL && (
            <button className="contact-item" onClick={() => openLink(instagramURL)}>
              <div className="contact-icon instagram">
                <img src="/instagram.png" alt="" className="w-6 h-6" />
              </div>
              <div>
                <div className="contact-text">Instagram</div>
                <div className="contact-sub">Follow us</div>
              </div>
            </button>
          )}

          {googleURL && (
            <button className="contact-item" onClick={(e) => { e.preventDefault(); openLink(googleURL); }}>
              <div className="contact-icon google">
                <img src="/google.png" alt="" className="w-6 h-6" />
              </div>
              <div>
                <div className="contact-text">Google Business</div>
                <div className="contact-sub">Leave a review</div>
              </div>
            </button>
          )}

          {justDialLink && (
            <button className="contact-item" onClick={(e) => { e.preventDefault(); openLink(justDialLink); }}>
              <div className="contact-icon jd">
                <img src="/justdial.png" alt="" className="w-6 h-6" />
              </div>
              <div>
                <div className="contact-text">JustDial</div>
                <div className="contact-sub">Reviews</div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );


}