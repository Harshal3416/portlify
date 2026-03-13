import { useMutation } from "@tanstack/react-query";
import { getUserSettings } from "@/services/settingsService";

export const useSettings = () => {
  return useMutation({
    mutationFn: getUserSettings
  });
};