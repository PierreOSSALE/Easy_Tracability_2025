// EASY-TRACABILITY: frontend/src/hooks/useDataWarehouse.ts
import { useState, useCallback } from "react";
import { queryFacts, queryDimension } from "../services/dataWarehouse.service";
import { FactInventory } from "../types/factInventory";
import { DimProduct, DimTime, DimUser } from "../types/dimension";

export const useDataWarehouse = () => {
  const [facts, setFacts] = useState<FactInventory[]>([]);
  const [dimension, setDimension] = useState<
    DimProduct | DimTime | DimUser | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadFacts = useCallback(async (filter: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryFacts(filter);
      setFacts(data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDimension = useCallback(
    async (dim: "product" | "time" | "user", key: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await queryDimension(dim, key);
        const typed = result as DimProduct | DimTime | DimUser;
        setDimension(typed);
      } catch (err: unknown) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    facts,
    dimension,
    loading,
    error,
    loadFacts,
    loadDimension,
  };
};
