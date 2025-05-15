// EASY-TRACABILITY:frontend/src/features/auth/services/auth.service.ts

import { apiClient } from "../../../services/api.service";
import { apiWrapper } from "../../../utils/apiWrapper";
import {
  AuthResponse,
  LoginPayload,
  ResetPasswordPayload,
} from "../types/auth";

interface ResetResponse {
  resetToken: string;
}

// Connexion
export const login = async (
  credentials: LoginPayload
): Promise<{
  user: AuthResponse["user"];
  accessToken?: string;
  refreshToken?: string;
}> => {
  return apiWrapper(async () => {
    const res = await apiClient.post("/auth/login", credentials);
    const { user, accessToken, refreshToken } = res.data;
    return { user, accessToken, refreshToken };
  });
};

// Rafraîchissement (si JWT)
export const refreshToken = (): Promise<{
  user: AuthResponse["user"];
  accessToken?: string;
  refreshToken?: string;
}> =>
  apiWrapper(async () => {
    const res = await apiClient.post("/auth/refresh");
    const { user, accessToken, refreshToken } = res.data;
    return { user, accessToken, refreshToken };
  });

// Déconnexion
export const logout = (): Promise<void> =>
  apiWrapper(async () => {
    await apiClient.post("/auth/logout");
  });

// Récupération du profil complet
export const getCurrentUser = (): Promise<{ user: AuthResponse["user"] }> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/auth/me");
    if (!res.data.user) {
      throw new Error("Utilisateur introuvable");
    }

    return { user: res.data.user };
  });
// Reset password
export const requestResetPassword = (email: string): Promise<ResetResponse> =>
  apiWrapper(async () => {
    const res = await apiClient.post("/auth/request-reset-password", { email });
    if (!res.data.resetToken) {
      throw new Error("Aucun token de réinitialisation trouvé");
    }
    return res.data;
  });

export const resetPassword = (payload: ResetPasswordPayload): Promise<void> =>
  apiWrapper(async () => {
    await apiClient.post("/auth/reset-password", payload);
  });
