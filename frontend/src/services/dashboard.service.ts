// EASY-TRACABILITY: frontend/src/services/dashboard.service.ts
import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import { IChartPoint, DashboardData } from "../types/dashboard";

/**
 * Tendance d’inventaire entre deux dates
 */
export const fetchInventoryTrend = (
  start: string,
  end: string
): Promise<IChartPoint[]> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/dashboard/trend", {
      params: { start, end },
    });
    return res.data as IChartPoint[];
  });

/**
 * Chiffre d’affaires par produit
 */
export const fetchSalesByProduct = (): Promise<IChartPoint[]> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/dashboard/sales");
    return res.data as IChartPoint[];
  });

/**
 * Alertes sur stock critique
 */
export const fetchAlerts = (threshold = 0): Promise<DashboardData["alerts"]> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/dashboard/alerts", {
      params: { threshold },
    });
    return res.data as DashboardData["alerts"];
  });
