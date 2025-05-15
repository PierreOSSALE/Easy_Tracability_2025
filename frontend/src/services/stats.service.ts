// EASY-TRACABILITY:frontend/src/services/stats.service.ts

import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import { StatsOverview } from "../types/stats";

// Récupère les statistiques globales
export const getOverviewStats = (): Promise<StatsOverview> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/states/overview");
    return res.data;
  });
};
