import apiClient from "@/lib/apiClient";

export const getProducts = async (tenantid:string) => {
  const { data } = await apiClient.get(`/products?tenantid=${tenantid}`);
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch products");
  }
  return data.data;
};

export const createProduct = async (formData: FormData) => {
  const { data } = await apiClient.post("/products", formData);

  if (!data.success) {
    throw new Error(data.error || "Failed to create product");
  }

  return data.data;
};

export const updateProduct = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const { data } = await apiClient.put(`/products/${id}`, formData);

  return data.rows[0];
};

export const deleteProduct = async ({productid}:{productid: string}) => {
    const response = await apiClient.delete(`/products/${productid}`);
    
    // Check if response has data with success flag
    // If the API call was successful, it should either:
    // 1. Have HTTP status 2xx, OR
    // 2. Have data.success === true
    const responseData = response.data;
    const isSuccess = response.status >= 200 && response.status < 300;
    console.log(responseData, isSuccess)
    if (isSuccess) {
        return responseData?.product?.rows ? responseData.product.rows[0] : responseData;
    }
    
    // If we got here, there was an error
    throw new Error(responseData?.error || "Failed to delete product");
}
