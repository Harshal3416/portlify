'use client';

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { getSiteDetails } from "../lib/siteDetails";

export default function About() {

  const [open, setOpen] = useState(false);

  const [siteTitle, setSiteTitle] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteLogoUrl, setSiteLogoUrl] = useState<string>("");

  useEffect(() => {
    getSiteDetails().then((details) => {
      console.log("Site details--->>:", details);
      setSiteTitle(details?.siteTitle || '');
      setOwnerName(details?.ownerName || "");
      setSiteDescription(details?.siteDescription || "");

      if (details?.siteLogoUrl && typeof details.siteLogoUrl === 'object' && details.siteLogoUrl.url) {
        setSiteLogoUrl("http://localhost:3000" + details.siteLogoUrl.url);
      }

    }).catch((error: any) => {
      console.error("Error fetching site details:", error);
    });
  }, []);

  const renderLogo = () => {
    // Show the logo if we have a URL
    if (siteLogoUrl) {
      return (
        <img
          src={siteLogoUrl}
          alt="Site Logo"
          className="w-20 h-auto rounded-md mb-6"
        />
      );
    }

    // Fallback to default logo
    return (
      <img
        src="/svslogo.png"
        alt="Default Logo"
        className="w-20 h-auto rounded-md mb-6"
      />
    );
  }

  return (
    <>
      <div className="bg-primary/5 py-4">
        <button>SHARE: TODO</button>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            {renderLogo()}
            {/* <img src="/svslogo.png" alt="SVS logo" className="w-22 h-auto rounded-md mb-6" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center" data-testid="text-about-title">
            Welcome to {siteTitle}
          </h1>
        </div>
      </div>

      <div className="w-[80%] mx-auto border-1 border-gray-300 rounded-md my-2">
        <div className="flex flex-row justify-between p-4" onClick={() => setOpen(!open)}>
          <span>
            About Us
          </span>
          <span>
            {open ? <FaArrowUp /> : <FaArrowDown />}
          </span>
        </div>
        {open && (
          <div className="flex flex-col items-center justify-between border-t border-gray-300 p-2">
            <div className="prose prose-lg max-w-none">
              <div className="text-muted-foreground leading-relaxed p-5">
                <span className="text-4xl md:text-2xl font-bold text-center">{ownerName}</span>
                {/* <span>Proprietor</span> */}
                <p>
                  {siteDescription}
                </p>
              </div>
            </div>
          </div>)}
      </div>
    </>
  );
}
