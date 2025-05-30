// EASY-TRACABILITY: frontend/src/hooks/useETL.ts
import { useState, useEffect, useCallback } from "react";
import { runETL, fetchETLLogs, ETLLog } from "../services/etl.service";

export const useETL = () => {
  const [logs, setLogs] = useState<ETLLog[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      const data = await fetchETLLogs();
      setLogs(data);
    } catch (err: unknown) {
      setError(err as Error);
    }
  }, []);

  const trigger = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      await runETL();
      await loadLogs();
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setRunning(false);
    }
  }, [loadLogs]);

  // Charger les logs au montage
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return { logs, running, error, trigger, refreshLogs: loadLogs };
};
