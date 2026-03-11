import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Default headers - don't set Content-Type globally so it can be overridden for FormData
apiClient.defaults.headers.common["Content-Type"] = "application/json";

// Intercept requests to handle FormData correctly
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export default apiClient;
