import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, getProducts, deleteProduct } from "@/services/productService";
import { useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";

// useQuery hook for fetching products (best practice for data fetching)
export const useGetProductsQuery = (tenantid: string | any) => {
  const { showToast } = useToast();

  const query = useQuery({
    queryKey: ["products", tenantid],
    queryFn: () => getProducts(tenantid),
    enabled: !!tenantid,
  });

  useEffect(() => {
    if (query.isError) {
      const error: any = query.error;
      showToast(error?.message || "Failed to load products", "danger");
    }
  }, [query.isError]);

  return query;
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
