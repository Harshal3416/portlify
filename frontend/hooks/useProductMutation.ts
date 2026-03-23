import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, getProducts, deleteProduct } from "@/services/productService";

// useQuery hook for fetching products (best practice for data fetching)
export const useGetProductsQuery = (tenantid: string | any) => {
  return useQuery({
    queryKey: ["products", tenantid],
    queryFn: () => getProducts(tenantid),
    enabled: !!tenantid, // Only run query when tenantid is available
  });
};

// useMutation hook for fetching products (legacy - prefer useQuery above)
// export const useGetProducts = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: getProducts,

//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] });
//         }
//     })
// }

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

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate products query to trigger a refetch and update UI
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
