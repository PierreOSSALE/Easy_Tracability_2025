// EASY-TRACABILITY:frontend/src/features/admin/services/user.service.ts

import { apiClient } from "../../../services/api.service";
import { apiWrapper } from "../../../utils/apiWrapper";
import { User } from "../../../types/user";

// Récupérer tous les utilisateurs
export const fetchUsers = (): Promise<User[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/users");
    return res.data;
  });
};

// Récupérer un utilisateur par son UUID
export const fetchUserById = (uuid: string): Promise<User> => {
  return apiWrapper(async () => {
    const res = await apiClient.get(`/users/${uuid}`);
    return res.data;
  });
};

export const createUser = (userData: Omit<User, "uuid">): Promise<User> => {
  return apiWrapper(async () => {
    const res = await apiClient.post("/users", userData);
    return res.data;
  });
};

// Mettre à jour un utilisateur par son UUID
export const updateUser = (
  uuid: string,
  updates: Partial<Omit<User, "uuid">>
): Promise<User> => {
  return apiWrapper(async () => {
    const res = await apiClient.put(`/users/${uuid}`, updates);
    return res.data;
  });
};

// Supprimer un utilisateur par UUID
export const deleteUser = (uuid: string): Promise<void> => {
  return apiWrapper(async () => {
    await apiClient.delete(`/users/${uuid}`);
  });
};

// Rechercher des utilisateurs par username
export const searchUsersByUsername = (username: string): Promise<User[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get(`/users/search`, {
      params: { username },
    });
    return res.data;
  });
};

// Filtrer des utilisateurs par rôle
export const getUsersByRole = (role: string): Promise<User[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get(`/users/role`, {
      params: { role },
    });
    return res.data;
  });
};
