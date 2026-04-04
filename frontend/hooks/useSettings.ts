import { useMutation } from "@tanstack/react-query";
import { getAdminDetails, updateAdminDetails} from "@/services/settingsService";
import { useToast } from "@/app/context/ToastContext";

export const useSettings = (tenantid?: string) => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () => getAdminDetails(),

    onError: (error: any) => {
      showToast(error?.message || "Failed to fetch settings", "danger");
    },
  });
};

export const useUpdateSettings = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (formData: any) => updateAdminDetails(formData),

    onSuccess: () => {
      showToast("Settings updated successfully", "success");
    },

    onError: (error: any) => {
      showToast(error?.message || "Failed to update settings", "danger");
    },
  });
};