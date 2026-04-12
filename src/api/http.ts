import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const http = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — inject auth token
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401/403/500
http.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — force logout
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired. Please sign in again."));
    }

    if (status === 403) {
      return Promise.reject(new Error("You do not have permission for this action."));
    }

    if (status === 500) {
      return Promise.reject(new Error("Server error. Please try again later."));
    }

    return Promise.reject(error);
  }
);

export default http;
