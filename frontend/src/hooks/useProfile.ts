// EASY-TRACABILITY:frontend/src/hooks/useProfile.ts

import { useEffect, useState, useCallback } from "react";
import * as profileService from "../services/profile.service";
import { Profile } from "../types/profile";
import { ApiError } from "../utils/api";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.fetchMyProfile();
      setProfile(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError("Erreur inconnue", 500));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (payload: { email?: string; profilePicture?: File }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await profileService.updateMyProfile(payload);
        setProfile(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err);
        } else {
          setError(new ApiError("Erreur inconnue", 500));
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    update: updateProfile,
  };
};
