import apiClient from "@/lib/apiClient";

interface LoginDataType {
    email: string,
    password: string
}

export const loginUser = async (data: LoginDataType) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await apiClient.post("/logout");
  return res.data;
};
