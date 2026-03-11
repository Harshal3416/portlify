import apiClient from "@/lib/apiClient";

interface LoginDataType {
    email: string,
    password: string
}

interface RegisterDataType {
  name: string,
  email: string,
  mobile: string,
  password: string,
  shopid: string
}

export const loginUser = async (data: LoginDataType) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await apiClient.post("/logout");
  return res.data;
};

export const registerUser = async (data: RegisterDataType) => {
  const res = await apiClient.post("/auth/register", data);
  return res.data;
}