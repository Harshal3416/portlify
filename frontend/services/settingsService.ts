import apiClient from "@/lib/apiClient";

export const getUserSettings = async (shopid: string) => {
    console.log("SHOP ID in settings--->>", shopid)
  const res = await apiClient.get(`/site-details/${shopid}`);
  console.log("Received data", res)
  return res.data;
};

export const updateUserSettings = async (formData: FormData) => {
  const res = await apiClient.post(`/site-details`, formData);
  return res.data;
};
