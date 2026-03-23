'use client';

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useSiteDetails } from "../context/siteContext";
import { useSearchParams } from "next/navigation";

export default function About() {
  // const { user } = useAuth();
  // const router = useRouter();
  const siteDetails = useSiteDetails();
  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const tenantid = tenantidFromUrl; // Get tenantid: from URL params first, then from auth context, then fallback

  const [open, setOpen] = useState(false);
  const [sitetitle, setSiteTitle] = useState("");
  const [ownername, setOwnerName] = useState("");
  const [sitedescription, setSiteDescription] = useState("");
  const [sitelogourl, setSiteLogoUrl] = useState<string>("");

  useEffect(() => {
    if (!tenantid) return;

    if(siteDetails) {
      setSiteTitle(siteDetails.sitetitle);
      setSiteDescription(siteDetails.sitedescription || '')
      setOwnerName(siteDetails.ownername || '')
      if (siteDetails?.sitelogourl && typeof siteDetails.sitelogourl === 'object' && siteDetails.sitelogourl.url) {
        setSiteLogoUrl("http://localhost:3000" + siteDetails.sitelogourl.url);
      }
    }
  }, [siteDetails]);

  const renderLogo = () => {
    // Show the logo if we have a URL
    if (sitelogourl) {
      return (
        <img
          src={sitelogourl}
          alt="Site Logo"
          className="w-20 h-auto rounded-md mb-6"
        />
      );
    }

    // Fallback to default logo
    // return (
    //   <img
    //     src="/logo.jpg"
    //     alt="Default Logo"
    //     className="w-20 h-auto rounded-md mb-6"
    //   />
    // );
  }

  return (
    <>
      <div className="bg-primary/5 py-4">
        {/* <button>SHARE: TODO</button> */}

        {/* <button className="px-4 py-2 border-1 text-black rounded-md mt-3 border border-gray-400 disabled:opacity-60"
          onClick={() => router.push("/admin/products")}>Admin</button> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            {renderLogo()}
            {/* <img src="/svslogo.png" alt="SVS logo" className="w-22 h-auto rounded-md mb-6" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center" data-testid="text-about-title">
            Welcome to {sitetitle}
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
                <span className="text-4xl md:text-2xl font-bold text-center">{ownername}</span>
                {/* <span>Proprietor</span> */}
                <p>
                  {sitedescription}
                </p>
              </div>
            </div>
          </div>)}
      </div>
    </>
  );
}
