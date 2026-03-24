import axios from "axios";

let getTokenFn: null | (() => Promise<string | null>) = null;

export const setAuthTokenGetter = (fn: () => Promise<string | null>) => {
  getTokenFn = fn;
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

apiClient.defaults.headers.common["Content-Type"] = "application/json";

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  if (config.url?.startsWith("/admin") && getTokenFn) {
    const token = await getTokenFn();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ✅ Response interceptor (IMPORTANT)
apiClient.interceptors.response.use(
  (response) => {
    return response; // success passthrough
  },
  (error) => {
    // Normalize error
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    return Promise.reject({
      message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
  }
);

export default apiClient;