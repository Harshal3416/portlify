"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUserSettings } from "../../services/settingsService";
import { SiteDetail } from "@/app/interfaces/interface";
import { useSearchParams } from "next/navigation";

const SiteContext = createContext<SiteDetail | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteDetails, setSiteDetails] = useState<SiteDetail | null>(null);

  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const tenantid = tenantidFromUrl;

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (!tenantid) {
          console.log("No tenantid available");
          return;
        }
        const details = await getUserSettings(tenantid);
        console.log("Context Data", details);
        setSiteDetails(details);
      } catch (error) {
        console.error("Failed to load site details:", error);
      }
    };
    loadDetails();
  }, [tenantid]);

  return (
    <SiteContext.Provider value={siteDetails}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteDetails() {
  return useContext(SiteContext);
}
