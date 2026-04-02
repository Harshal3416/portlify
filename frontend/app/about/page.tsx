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
  }

const hasAboutData = ownername || sitedescription;

return (
  <div className="card">
      <div className="custom-card-header">
        <div className="card-title"><div className="card-title-icon">👤</div>About Us</div>
      </div>
      <div className="card-body">
        <div className="owner-row">
          <div className="owner-avatar">{ownername.charAt(0)}</div>
          <div><div className="owner-name">{ownername}</div><div className="owner-role">Owner & Proprietor</div></div>
        </div>
        <p className="about-text">{sitedescription}</p>
      </div>
    </div>
  // <>
  //   {/* Hero Section */}
  //   <div className="bg-primary/5 py-6">
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
  //       {sitelogourl && (
  //         <div className="flex justify-center mb-4">
  //           {renderLogo()}
  //         </div>
  //       )}

  //       {sitetitle && (
  //         <h1
  //           className="text-3xl md:text-5xl font-bold"
  //           data-testid="text-about-title"
  //         >
  //           Welcome to {sitetitle}
  //         </h1>
  //       )}
  //     </div>
  //   </div>

  //   {/* About Section */}
  //   {hasAboutData && (
  //     <div className="w-[80%] mx-auto border border-gray-300 rounded-md my-4 overflow-hidden">
        
  //       {/* Header */}
  //       <div
  //         className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
  //         onClick={() => setOpen(!open)}
  //       >
  //         <span className="font-medium text-lg">About Us</span>
  //         {open ? <FaArrowUp /> : <FaArrowDown />}
  //       </div>

  //       {/* Content */}
  //       {open && (
  //         <div className="border-t border-gray-200 p-3 space-y-3">
            
  //           {ownername && (
  //             <h2 className="text-xl md:text-2xl font-semibold">
  //               {ownername}
  //             </h2>
  //           )}

  //           {sitedescription && (
  //             <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
  //               {sitedescription}
  //             </p>
  //           )}

  //         </div>
  //       )}
  //     </div>
  //   )}
  // </>
);
}
