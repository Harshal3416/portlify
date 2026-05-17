import apiClient from "@/lib/apiClient";

export interface BusinessListing {
  tenantid: string;
  siteLogo: string | Record<string, unknown> | null;
  siteTitle: string | null;
  ownerName: string | null;
  shopType: string | null;
  siteDescription: string | null;
  address: string | null;
}

// ============================================
// Fetch all businesses (for directory/home)
// ============================================
export const fetchAllBusinesses = async (filters?: {
  cat?: string;
  search?: string;
}): Promise<BusinessListing[]> => {
  try {
    const response = await apiClient.get("/businesses", {
      params: filters,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
};
