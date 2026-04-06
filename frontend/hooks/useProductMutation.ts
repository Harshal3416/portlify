import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollection, updateCollection, getProducts, deleteProduct } from "@/services/productService";
import { useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";

// useQuery hook for fetching collections (best practice for data fetching)
export const useGetProductsQuery = (tenantid: string | any) => {
  const { showToast } = useToast();

  const query = useQuery({
    queryKey: ["collections", tenantid],
    queryFn: () => getProducts(tenantid),
    enabled: !!tenantid,
  });

  useEffect(() => {
    if (query.isError) {
      const error: any = query.error;
      showToast(error?.message || "Failed to load collections", "danger");
    }
  }, [query.isError]);

  return query;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollection,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCollection,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate collections query to trigger a refetch and update UI
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};
