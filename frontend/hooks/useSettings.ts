import { useMutation } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/services/settingsService";

export const useSettings = (tenantid?: string) => useMutation({
  mutationFn: () => getUserSettings(tenantid)
});

export const useUpdateSettings = () => useMutation({
  mutationFn: (formData: FormData) => updateUserSettings(formData)
});
