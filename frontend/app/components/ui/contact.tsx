'use client';

import { getSiteDetails } from "@/app/lib/siteDetails";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function Contact() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const shopidFromUrl = searchParams.get('shop');
  
  const [open, setOpen] = useState(false);
  const [gmailId, setContactEmail] = useState("");
  const [phoneNumber, setContactPhone] = useState("");
  const [alternatePhoneNumber, setAlternateContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instagramURL, setInstagramURL] = useState("");
  const [googleURL, setGoogleURL] = useState("");
  const [justDialLink, setJustDialURL] = useState("");
  const [gmapLink, setGmapLink] = useState("");

  // Get shopid: from URL params first, then from auth context, then fallback
  const shopid = shopidFromUrl || user?.shopid || '';

  useEffect(() => {
    if (!shopid) return;
    
    getSiteDetails(shopid).then((details) => {
      console.log("Site details--->>:", details);
      setContactEmail(details?.contactemail || "");
      setContactPhone(details?.contactphone || "");
      setAlternateContactPhone(details?.alternatecontactphone || "");
      setAddress(details?.address || "");
      setInstagramURL(details?.instagramurl || "");
      setGoogleURL(details?.googleurl || "");
      setJustDialURL(details?.justdialurl || "");
      setGmapLink(details?.gmapLink || "");
    }).catch((error: any) => {
      console.error("Error fetching site details:", error);
    });
  }, []);

  const openWhatsapp = () => {
    const message = "Hello, I would like to inquire about your products."; // replace with your default message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  const openGmail = () => {
    const subject = "Inquiry about products"; // replace with your default subject
    const body = "Hello, I would like to inquire about your products."; // replace with your default message
    const url = `mailto:${gmailId}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  }

  const openPhoneDialer = (mob: number) => {
    const phoneNumber = mob; // replace with your phone number
    const url = `tel:${phoneNumber}`;
    window.open(url, "_blank");
  }

  const openLink = (url: string) => {
    window.open(url, "_blank");
  }

  return (
    <div className="w-[80%] mx-auto border-1 border-gray-300 rounded-md my-2">
      <div className="flex flex-row justify-between p-4" onClick={() => setOpen(!open)}>
        <span>
          Contact Details
        </span>
        <span>
          {open ? <FaArrowUp /> : <FaArrowDown />}
        </span>
      </div>
      {open && (
        <div className="flex flex-col justify-between border-t border-gray-300 p-2">
          <div className="flex flex-col justify-between my-2">
              <p className="text-lg m-2" onClick={openGmail}><span><img src="/gmail.jpg" alt="Email Icon" width={800}
                height={500} className="w-12 h-12 mr-2 inline-block"></img></span>{gmailId}</p>
              <p className="text-lg m-2"><span><img src="/phone.jpg" alt="Email Icon" width={800}
                height={500} className="w-12 h-12 mr-2 inline-block"></img></span><span onClick={() => openPhoneDialer(Number(phoneNumber))}>{phoneNumber}</span> | <span onClick={() => openPhoneDialer(Number(alternatePhoneNumber))}>{alternatePhoneNumber}</span></p>
              <p className="text-lg m-2" onClick={() => openLink(gmapLink)}><span><img src="/gmap.jpg" alt="Email Icon" width={800}
                height={500} className="w-12 h-12 mr-2 inline-block"></img></span>{address}</p>
              <button className="bg-green-500 text-white font-bold p-2 rounded m-2" onClick={openWhatsapp}><span><img src="/whatsapp.jpg" alt="WhatsApp Icon" width={800} height={500} className="w-12 h-12 mr-2 inline-block"></img></span>Chat over WhatsApp</button>
          </div>
          <div className="flex flex-row justify-center my-2">
            <img src="/instagram.png" onClick={() => openLink(instagramURL)} alt="Instagram" width={800} height={500} className="w-12 h-12 mr-4 inline-block"></img>
            <img src="/google.png" onClick={() => openLink(googleURL)} alt="Google" width={800} height={500} className="w-12 h-12 mr-4 inline-block"></img>
            <img src="/justDial.png" onClick={() => openLink(justDialLink)} alt="Just Dial" width={4000} height={500} className="w-25 h-12 mr-2 inline-block"></img>
          </div>
        </div>)}
    </div>
  );
}