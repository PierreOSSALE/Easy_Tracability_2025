// EASY-TRACABILITY:frontend/src/hooks/useStats.ts

import { useEffect, useState, useCallback } from "react";
import * as statsService from "../services/stats.service";
import { StatsOverview } from "../types/stats";

export const useStats = () => {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statsService.getOverviewStats();
      setStats(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
