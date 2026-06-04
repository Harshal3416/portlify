"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from '@clerk/nextjs';
import { getAdminContactDetails, getAdminDetails, getSiteInformation, getBusinessDetails } from "../../services/settingsService";
import { SiteDetail } from "@/app/interfaces/interface";
import { useSearchParams } from "next/navigation";

interface SiteContextType {
  siteDetails: SiteDetail | null;
  authTenantId: string | null;
  isAuthorizedTenant: boolean;
  authTenantLoaded: boolean;
  refetchSiteInfo: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteDetails, setSiteDetails] = useState<SiteDetail | null>(null);

  // Only use search params on client side
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams?.get('tenantid') || null;
  const tenantid = tenantidFromUrl;
  const [tenantidfromdb, setTenantidFromDb] = useState('');
  const [authTenantId, setAuthTenantId] = useState<string | null>(null);
  const [authTenantLoaded, setAuthTenantLoaded] = useState(false);
  const [isAuthorizedTenant, setIsAuthorizedTenant] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && tenantid) {
      loadDetails();
    }
  }, [isClient, tenantid]);

  useEffect(() => {
    if (!isLoaded) return;

    const loadAuthTenant = async () => {
      try {
        if (!user) {
          setAuthTenantId(null);
          return;
        }

        const authAdminData = await getAdminDetails();
        setAuthTenantId(authAdminData?.tenantid || null);
      } catch (error) {
        console.error('Failed to load authenticated admin details:', error);
        setAuthTenantId(null);
      } finally {
        setAuthTenantLoaded(true);
      }
    };

    loadAuthTenant();
  }, [isLoaded, user]);

  useEffect(() => {
    setIsAuthorizedTenant(Boolean(authTenantId && tenantid && authTenantId === tenantid));
  }, [authTenantId, tenantid]);

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
    if (isClient && !tenantid) {
      // If no tenantid from URL, try to load with empty string or default
      loadDetails();
    }
  }, [isClient]);

  const loadDetails = async () => {
    try {
      // if (tenantid) {
      //   const details = await getBusinessDetails(tenantid);
      //   if (details) {
      //     setTenantidFromDb(details.tenantid || "");
      //     setSiteDetails(details);
      //     return;
      //   }
      // }

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
    <SiteContext.Provider value={{ siteDetails, authTenantId, isAuthorizedTenant, authTenantLoaded, refetchSiteInfo }}>
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
