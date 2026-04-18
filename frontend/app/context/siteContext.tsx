"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAdminContactDetails, getAdminDetails, getSiteInformation } from "../../services/settingsService";
import { SiteDetail } from "@/app/interfaces/interface";
import { useSearchParams } from "next/navigation";

interface SiteContextType {
  siteDetails: SiteDetail | null;
  refetchSiteInfo: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteDetails, setSiteDetails] = useState<SiteDetail | null>(null);

  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const tenantid = tenantidFromUrl;
  const [tenantidfromdb, setTenantidFromDb] = useState('');

  const refetchSiteInfo = useCallback(async () => {
    loadDetails();
    console.log("Refetching site info with tenantid", tenantid, "and tenantidfromdb", tenantidfromdb);
    if (!tenantidfromdb || !tenantid) return;
    try {
      const siteData = await getSiteInformation(tenantidfromdb || tenantid);
      setSiteDetails((prev) => prev ? { ...prev, ...siteData } : siteData);
      console.log("Site info refetched from context", siteData);
    } catch (error) {
      console.error("Failed to refetch site info:", error);
    }
  }, [tenantid, tenantidfromdb]);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const adminData = await getAdminDetails(tenantid || "");
      setTenantidFromDb(adminData.tenantid);
      const siteData = await getSiteInformation(adminData.tenantid);
      const contactDetails = await getAdminContactDetails(adminData.tenantid);
      const details = adminData ? { ...adminData, ...siteData, ...contactDetails } : { ...siteData, ...contactDetails };
      console.log("Context Data", details);
      setSiteDetails(details);
    } catch (error) {
      console.error("Failed to load site details:", error);
      setSiteDetails(null);
    }
  };

  return (
    <SiteContext.Provider value={{ siteDetails, refetchSiteInfo }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteDetails() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteDetails must be used within a SiteProvider');
  }
  return context;
}
