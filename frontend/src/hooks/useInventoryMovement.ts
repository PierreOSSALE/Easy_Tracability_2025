// EASY-TRACABILITY:frontend/src/hooks/useInventoryMovement.ts

import { useEffect, useState, useCallback } from "react";
import * as InventoryService from "../services/InventoryMovement.service";
import { InventoryMovement, OperationType } from "../types/inventoryMovement";

export const useInventoryMovements = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAllMovements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await InventoryService.fetchInventoryMovements();
      setMovements(data.rows);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllMovements();
  }, [loadAllMovements]);

  const getMovementById = useCallback(
    async (uuid: string): Promise<InventoryMovement | null> => {
      try {
        return await InventoryService.getInventoryMovementById(uuid);
      } catch (err: unknown) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const addMovement = useCallback(
    async (movement: Omit<InventoryMovement, "uuid">) => {
      const newMovement =
        await InventoryService.createInventoryMovement(movement);
      setMovements((prev) => [...prev, newMovement]);
    },
    []
  );

  const removeMovement = useCallback(async (uuid: string) => {
    await InventoryService.deleteInventoryMovement(uuid);
    setMovements((prev) => prev.filter((m) => m.uuid !== uuid));
  }, []);

  const modifyMovement = useCallback(
    async (uuid: string, updates: Partial<Omit<InventoryMovement, "uuid">>) => {
      const updated = await InventoryService.updateInventoryMovement(
        uuid,
        updates
      );
      setMovements((prev) => prev.map((m) => (m.uuid === uuid ? updated : m)));
    },
    []
  );

  const loadRecentMovements = useCallback(async () => {
    const recent = await InventoryService.fetchRecentInventoryMovements();
    setMovements(recent);
  }, []);

  const loadMovementsByOperation = useCallback(
    async (operationType: OperationType) => {
      const filtered =
        await InventoryService.fetchInventoryMovementsByOperation(
          operationType
        );
      setMovements(filtered);
    },
    []
  );

  const exportCSV = useCallback(async (): Promise<Blob | null> => {
    try {
      return await InventoryService.exportInventoryMovementsCSV();
    } catch (err: unknown) {
      setError(err as Error);
      return null;
    }
  }, []);

  return {
    movements,
    loading,
    error,
    getMovementById,
    addMovement,
    removeMovement,
    modifyMovement,
    loadAllMovements,
    loadRecentMovements,
    loadMovementsByOperation,
    exportCSV,
  };
};
