import apiClient from "@/lib/apiClient";

export const getProducts = async () => {
  const { data } = await apiClient.get("/products");
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