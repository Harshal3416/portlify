import apiClient from "@/lib/apiClient";
import { SiteDetail } from "@/app/interfaces/interface";

export const getUserSettings = async (tenantid?: string): Promise<SiteDetail | null> => {
  if (!tenantid) {
    console.warn("getUserSettings no tenantid");
    return null;
  }
  console.log("Settings fetch for:", tenantid);
  const res = await apiClient.get(`/site-details/${tenantid}`);
  console.log("Settings res:", res.data);
  return res.data?.data[0] ?? null;
};

export const updateUserSettings = async (formData: FormData) => {
  const res = await apiClient.post(`/site-details`, formData);
  return res.data;
};

export const getAdminDetails = async () => {
  const res = await apiClient.get(`/admin-details`);
  return res.data?.data ?? null;
}

export const updateAdminDetails = async (data: { tenantid: string; tenantdomain: string }) => {
  const res = await apiClient.post(`/admin-details`, data);
  console.log("updateAdminDetails", res)
  return res.data?.data ?? null;
}
