// EASY-TRACABILITY: frontend/src/services/etl.service.ts
import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";

export interface ETLLog {
  id: number;
  runDate: string;
  status: "SUCCESS" | "FAILURE";
  rowsExtracted: number;
  rowsLoaded: number;
  errorMessage?: string;
}

/**
 * Déclenche manuellement un job ETL
 */
export const runETL = (): Promise<void> =>
  apiWrapper(async () => {
    await apiClient.post("/etl/run");
  });

/**
 * Récupère l’historique des exécutions ETL
 */
export const fetchETLLogs = (): Promise<ETLLog[]> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/etl/logs");
    return res.data as ETLLog[];
  });
