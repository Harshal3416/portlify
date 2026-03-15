import { useMutation } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/services/settingsService";

export const useSettings = (shopid?: string) => useMutation({
  mutationFn: () => getUserSettings(shopid)
});

export const useUpdateSettings = () => useMutation({
  mutationFn: (formData: FormData) => updateUserSettings(formData)
});
