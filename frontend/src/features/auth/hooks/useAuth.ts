// EASY-TRACABILITY: frontend/src/features/auth/hooks/useAuth.ts

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPayload, AuthResponse } from "../types/auth";
import * as authService from "../services/auth.service";
import { setAccessToken } from "../../../services/api.service";

export interface UseAuthResult {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<AuthResponse["user"]>;
  logout: () => Promise<void>;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const login = useCallback(async (credentials: LoginPayload) => {
    // console.log("[useAuth] login start");
    setLoading(true);
    const { user: loggedUser, accessToken } =
      await authService.login(credentials);
    // console.log("[useAuth] login token:", accessToken);
    setAccessToken(accessToken ?? null);
    // console.log(
    //   "[useAuth] storage after set:",
    //   sessionStorage.getItem("accessToken")
    // );
    setUser(loggedUser);
    setLoading(false);
    return loggedUser;
  }, []);

  const logout = useCallback(async () => {
    // console.log("[useAuth] logout start");
    setLoading(true);
    await authService.logout();
    setAccessToken(null);
    setUser(null);
    setLoading(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  const refresh = useCallback(async () => {
    // console.log("[useAuth] refresh start");
    try {
      const { accessToken, user: currentUser } =
        await authService.refreshToken();
      // console.log("[useAuth] refresh token:", accessToken);
      setAccessToken(accessToken ?? null);
      setUser(currentUser);
    } catch {
      await logout();
    }
  }, [logout]);

  useEffect(() => {
    (async () => {
      // console.log("[useAuth] init effect");
      const token = sessionStorage.getItem("accessToken");
      // console.log("[useAuth] init token:", token);
      if (token) {
        setAccessToken(token);
        try {
          const { user: currentUser } = await authService.getCurrentUser();
          setUser(currentUser);
        } catch {
          setAccessToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, [logout]);

  // console.log("[useAuth] render", { user, loading });
  return { user, isAuthenticated: !!user, login, logout, loading, refresh };
};
