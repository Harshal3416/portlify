import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, getProducts } from "@/services/productService";

// useQuery hook for fetching products (best practice for data fetching)
export const useGetProductsQuery = (shopid: string) => {
  return useQuery({
    queryKey: ["products", shopid],
    queryFn: getProducts,
    enabled: !!shopid, // Only run query when shopid is available
  });
};

// useMutation hook for fetching products (legacy - prefer useQuery above)
export const useGetProducts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: getProducts,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};