import { useMutation } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/services/settingsService";

export const useSettings = () => useMutation({
  mutationFn: getUserSettings
});

export const useUpdateSettings = () => useMutation({
  mutationFn: (formData: FormData) => updateUserSettings(formData)
});
