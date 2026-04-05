import apiClient from "@/lib/apiClient";
import { SiteDetail } from "@/app/interfaces/interface";

// admin details
export const getAdminDetails = async () => {
  const res = await apiClient.get(`/admin-details`);
  return res.data?.data ?? null;
}

export const updateAdminDetails = async (data: { tenantid: string; ownername: string; ownertitle: string; aboutowner: string; yearsofexperience: string; productssold: string; happyclients: string; }) => {
  try {
    const res = await apiClient.post(`/admin-details`, data);
    return res.data?.data ?? null;
  } catch (err: any) {
    // Pass clean error message upward
    throw err.response?.data?.error || "Something went wrong";
  }
};

// siteinformation
export const getSiteInformation = async (tenantid?: string): Promise<SiteDetail | null> => {
  if (!tenantid) {
    console.warn("getUserSettings no tenantid");
    return null;
  }
  console.log("Settings fetch for:", tenantid);
  const res = await apiClient.get(`/site-details/siteinformation/${tenantid}`);
  console.log("getSiteInformation res:", res.data);
  return res.data.data ?? null;
};

export const updateSiteInformation = async (data: {tenantid: string; sitelogourl: File | null; sitetitle: string; sitesubtitle: string; trustedtagline:string; sitedescription: string; }) => {
  console.log("Updating site information with data:", data);
  const formData = new FormData();
  formData.append('tenantid', data.tenantid);
  formData.append('sitetitle', data.sitetitle);
  formData.append('sitesubtitle', data.sitesubtitle);
  formData.append('trustedtagline', data.trustedtagline);
  formData.append('sitedescription', data.sitedescription);

  if (data.sitelogourl instanceof File) {
    formData.append('sitelogourl', data.sitelogourl);
  }

  const res = await apiClient.post(`/site-details/siteinformation`, formData);
  return res.data;
};

// admin contact details
export const getAdminContactDetails = async (tenantid?: string): Promise<SiteDetail | null> => {
  if (!tenantid) {
    console.warn("admin contact details no tenantid");
    return null;
  }
  console.log("Settings fetch for:", tenantid);
  const res = await apiClient.get(`/site-details/admincontact/${tenantid}`);
  console.log("admincontact res:", res.data);
  return res.data?.data ?? null;
};

export const updateAdminContactDetails = async (data: { tenantid: string; contactemail: string; contactphone: string; alternatecontactphone: string; address: string; }) => {
  try {
    const res = await apiClient.post(`/site-details/admincontact`, data);
    return res.data?.data ?? null;
  } catch (err: any) {
    // Pass clean error message upward
    throw err.response?.data?.error || "Something went wrong";
  }
};

// admin social links
export const getAdminSocialLinks = async (tenantid?: string): Promise<SiteDetail | null> => {
  if (!tenantid) {
    console.warn("getUserSettings no tenantid");
    return null;
  }
  console.log("Settings fetch for:", tenantid);
  const res = await apiClient.get(`/site-details/adminsocial/${tenantid}`);
  console.log("Settings res:", res.data);
  return res.data?.data ?? null;
};

export const updateAdminSocialLinks = async (data: { tenantid: string; instagramurl: string; googlemapurl: string; justdialurl: string; }) => {
  try {
    const res = await apiClient.post(`/site-details/adminsocial`, data);
    return res.data?.data ?? null;
  } catch (err: any) {
    // Pass clean error message upward
    throw err.response?.data?.error || "Something went wrong";
  }
};

// opening hours
export const getOpeningHours = async (tenantid?: string): Promise<SiteDetail | null> => {
  if (!tenantid) {
    console.warn("getUserSettings no tenantid");
    return null;
  }
  console.log("Settings fetch for:", tenantid);
  const res = await apiClient.get(`/site-details/openinghours/${tenantid}`);
  console.log("Settings res:", res.data);
  return res.data?.data ?? null;
};

export const updateOpeningHours = async (data: { tenantid: string; monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; saturday: string; sunday: string; }) => {
  try {
    const res = await apiClient.post(`/site-details/openinghours`, data);
    return res.data?.data ?? null;
  } catch (err: any) {
    // Pass clean error message upward
    throw err.response?.data?.error || "Something went wrong";
  }
};

