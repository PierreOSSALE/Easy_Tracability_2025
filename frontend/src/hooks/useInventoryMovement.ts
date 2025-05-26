// EASY-TRACABILITY:frontend/src/hooks/useInventoryMovement.ts

import { useEffect, useState, useCallback } from "react";
import {
  fetchMovementLines,
  fetchRecentMovementLines,
  fetchMovementLinesByOperation,
  exportMovementLinesCSV,
  getMovementLineById,
} from "../services/InventoryMovement.service";
import { MovementLine } from "../types/inventoryMovement";
import { OperationType } from "../types/inventoryMovement";

export const useInventoryMovements = () => {
  const [lines, setLines] = useState<MovementLine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAllLines = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMovementLines();
      setLines(data.rows);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllLines();
  }, [loadAllLines]);

  const getLine = useCallback(
    async (uuid: string): Promise<MovementLine | null> => {
      try {
        const line = await getMovementLineById(uuid);
        return line;
      } catch (err: unknown) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const loadRecent = useCallback(async () => {
    try {
      const recent = await fetchRecentMovementLines();
      setLines(recent);
    } catch (err: unknown) {
      setError(err as Error);
    }
  }, []);

  const loadByOperation = useCallback(async (operation: OperationType) => {
    try {
      const filtered = await fetchMovementLinesByOperation(operation);
      setLines(filtered);
    } catch (err: unknown) {
      setError(err as Error);
    }
  }, []);

  const exportCSV = useCallback(async (): Promise<Blob | null> => {
    try {
      return await exportMovementLinesCSV();
    } catch (err: unknown) {
      setError(err as Error);
      return null;
    }
  }, []);

  return {
    lines,
    loading,
    error,
    loadAllLines,
    getLine,
    loadRecent,
    loadByOperation,
    exportCSV,
  };
};
