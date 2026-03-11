import { useMutation } from "@tanstack/react-query";
import { loginUser, logoutUser, registerUser } from "@/services/authService";

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

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser
    })
} 