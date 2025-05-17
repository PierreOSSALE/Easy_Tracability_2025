// EASY-TRACABILITY:frontend/src/services/profile.service.ts

import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import { Profile } from "../types/profile";

// Récupérer le profil connecté
export const fetchMyProfile = (): Promise<Profile> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  });
};

// Mettre à jour le profil connecté (email + photo)
export const updateMyProfile = (payload: {
  email?: string;
  profilePicture?: File;
}): Promise<Profile> => {
  const formData = new FormData();
  if (payload.email) formData.append("email", payload.email);
  if (payload.profilePicture)
    formData.append("profilePicture", payload.profilePicture);

  return apiWrapper(async () => {
    const res = await apiClient.put("/auth/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  });
};
