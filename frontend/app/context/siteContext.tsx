"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getUserSettings } from "../../services/settingsService";
import { useAuth } from "./AuthContext";
import { SiteDetail } from "@/app/interfaces/interface";
import { useSearchParams } from "next/navigation";

const SiteContext = createContext<SiteDetail | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteDetails, setSiteDetails] = useState<SiteDetail | null>(null);
  const { user } = useAuth();

  const searchParams = useSearchParams();
  const shopidFromUrl = searchParams.get('shop');
  const shopid = shopidFromUrl || user?.shopid || '';

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (!shopid) {
          console.log("No shopid available");
          return;
        }
        const details = await getUserSettings(shopid);
        console.log("Context Data", details);
        setSiteDetails(details);
      } catch (error) {
        console.error("Failed to load site details:", error);
      }
    };
    loadDetails();
  }, []);

  return (
    <SiteContext.Provider value={siteDetails}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteDetails() {
  return useContext(SiteContext);
}
