// EASY-TRACABILITY: frontend/src/services/dataWarehouse.service.ts
import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import { FactInventory } from "../types/factInventory";

/**
 * Fait une requête sur les faits, filtres facultatifs
 * @param params { startDate?: string; endDate?: string }
 */
export const queryFacts = (params: {
  startDate?: string;
  endDate?: string;
}): Promise<FactInventory[]> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/dw/facts", { params });
    return res.data as FactInventory[];
  });

/**
 * Interroge une dimension donnée par clé primaire
 */
export const queryDimension = <T>(
  dim: "product" | "time" | "user",
  key: string
): Promise<T> =>
  apiWrapper(async () => {
    // clé sans ':' devant
    const cleanKey = key.replace(/^:+/, "");
    const res = await apiClient.get<T>(`/dw/dimension/${dim}/${cleanKey}`);
    return res.data;
  });
