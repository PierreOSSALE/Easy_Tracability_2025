// EASY-TRACABILITY:frontend/src/services/configuration.service.ts

import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import { Configuration } from "../types/configuration";

// Obtenir toutes les configurations
export const fetchAllConfigurations = (): Promise<Configuration[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/configurations");
    return res.data;
  });
};

// Créer une nouvelle configuration
export const createConfiguration = (
  config: Omit<Configuration, "uuid" | "lastModifiedAt" | "lastModifiedBy">
): Promise<Configuration> => {
  return apiWrapper(async () => {
    const res = await apiClient.post("/configurations", config);
    return res.data;
  });
};

// Mettre à jour une configuration par son nom (clé)
export const updateConfiguration = (
  parameterKey: string,
  config: Partial<
    Omit<
      Configuration,
      "uuid" | "parameterKey" | "lastModifiedAt" | "lastModifiedBy"
    >
  >
): Promise<Configuration> => {
  return apiWrapper(async () => {
    const res = await apiClient.put(`/configurations/${parameterKey}`, config);
    return res.data;
  });
};
