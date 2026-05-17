import { useQuery } from "@tanstack/react-query";
import { fetchAllBusinesses } from "@/services/businessService";
import { useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";

// ============================================
// Fetch all businesses (for directory/home)
// ============================================
export const useGetBusinessesQuery = (filters?: {
  cat?: string;
  search?: string;
}) => {
  const { showToast } = useToast();

  const query = useQuery({
    queryKey: ["businesses", filters?.cat, filters?.search],
    queryFn: () => fetchAllBusinesses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  useEffect(() => {
    if (query.isError) {
      const error: any = query.error;
      showToast(error?.message || "Failed to load businesses", "danger");
    }
  }, [query.isError, showToast]);

  return query;
};
