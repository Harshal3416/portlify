import apiClient from "@/lib/apiClient";

export const getUserSettings = async (shopid:any) => {
    console.log("SHOP ID in settings--->>", shopid)
  const res = await apiClient.get(`/site-details/${shopid}`);
  console.log("Received data", res)
  return res.data;
};