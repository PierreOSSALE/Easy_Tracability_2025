// EASY-TRACABILITY: frontend/src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from "react";
import {
  fetchInventoryTrend,
  fetchSalesByProduct,
  fetchAlerts,
} from "../services/dashboard.service";
import { IChartPoint, DashboardData } from "../types/dashboard";

export const useDashboardData = (start?: string, end?: string) => {
  const [trend, setTrend] = useState<IChartPoint[]>([]);
  const [sales, setSales] = useState<IChartPoint[]>([]);
  const [alerts, setAlerts] = useState<DashboardData["alerts"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadTrend = useCallback(async () => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const data = await fetchInventoryTrend(start, end);
      setTrend(data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  const loadSales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSalesByProduct();
      setSales(data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAlerts = useCallback(async (threshold: number = 0) => {
    setLoading(true);
    try {
      const data = await fetchAlerts(threshold);
      setAlerts(data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrend();
    loadSales();
    loadAlerts();
  }, [loadTrend, loadSales, loadAlerts]);

  return {
    trend,
    sales,
    alerts,
    loading,
    error,
    refresh: { trend: loadTrend, sales: loadSales, alerts: loadAlerts },
  };
};
