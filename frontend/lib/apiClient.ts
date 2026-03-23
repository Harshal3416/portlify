import axios from "axios";

let getTokenFn: null | (() => Promise<string | null>) = null;

// Setter to inject Clerk token function
export const setAuthTokenGetter = (fn: () => Promise<string | null>) => {
  getTokenFn = fn;
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Default headers
apiClient.defaults.headers.common["Content-Type"] = "application/json";

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  // Handle FormData
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  // ✅ Attach token ONLY for /admin routes
  if (config.url?.startsWith("/admin") && getTokenFn) {
    const token = await getTokenFn();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default apiClient;