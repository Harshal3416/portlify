import { useMutation } from "@tanstack/react-query";
import { loginUser, logoutUser } from "@/services/authService";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser
  });
};