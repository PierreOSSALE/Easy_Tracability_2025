// EASY-TRACABILITY:frontend/src/services/api.service.ts

import axios from "axios";
import { refreshToken as refreshTokenService } from "../features/auth/services/auth.service";

let isRefreshing = false;
let refreshSubscribers: Array<(accessToken: string) => void> = [];

export const setAccessToken = (accessToken: string | null) => {
  // console.log("[api.service] setAccessToken:", accessToken);
  if (accessToken) {
    sessionStorage.setItem("accessToken", accessToken);
  } else {
    sessionStorage.removeItem("accessToken");
  }
};

export const getAccessToken = (): string | null => {
  const accessToken = sessionStorage.getItem("accessToken");
  // console.log("[api.service] getAccessToken:", accessToken);
  return accessToken;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Ajouter automatiquement le token dans les requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      // console.log("[api.service] Adding Authorization header");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Rafraîchir le token en cas de 401
apiClient.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;
  if (
    error.response?.status === 401 &&
    !originalRequest._retry &&
    !originalRequest.url.includes("/auth/login")
  ) {
    originalRequest._retry = true;
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await refreshTokenService();
        // console.log("[api.service] Token refreshed:", response.accessToken);
        setAccessToken(response.accessToken ?? null);
        refreshSubscribers.forEach((cb) => cb(response.accessToken ?? ""));
        refreshSubscribers = [];
      } catch (err) {
        // console.error("[api.service] Refresh token failed:", err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return new Promise((resolve) => {
      refreshSubscribers.push((accessToken: string) => {
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        resolve(apiClient(originalRequest));
      });
    });
  }
  return Promise.reject(error);
});
