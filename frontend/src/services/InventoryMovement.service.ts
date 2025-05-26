// EASY-TRACABILITY:frontend/src/services/inventoryMovement.service.ts

import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
// 🔥 Importez les bons types :
import { MovementLine } from "../types/inventoryMovement";

// Pagination de lignes de mouvement
export interface MovementLinePaginated {
  count: number;
  rows: MovementLine[];
}
// Récupérer toutes les lignes de mouvement
export const fetchMovementLines = (): Promise<MovementLinePaginated> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/inventoryMovements");
    return res.data;
  });

// Récupérer les lignes récentes
export const fetchRecentMovementLines = (): Promise<MovementLine[]> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/inventoryMovements/recent");
    return res.data;
  });

// Filtrer par type d’opération
export const fetchMovementLinesByOperation = (
  operationType: "ENTREE" | "SORTIE"
): Promise<MovementLine[]> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/inventoryMovements/by-operation", {
      params: { operationType },
    });
    return res.data;
  });

// Export CSV
export const exportMovementLinesCSV = (): Promise<Blob> =>
  apiWrapper(async () => {
    const res = await apiClient.get("/inventoryMovements/export", {
      responseType: "blob",
    });
    return res.data;
  });

// Détail d’une ligne
export const getMovementLineById = (uuid: string): Promise<MovementLine> =>
  apiWrapper(async () => {
    const res = await apiClient.get(`/inventoryMovements/${uuid}`);
    return res.data;
  });

// Création d’un mouvement complet (ordre + lignes + transaction)
export const createMovement = (payload: {
  ticketId: string;
  userUUID: string;
  date?: string;
  lines: Array<{
    productBarcode: string;
    operationType: string;
    quantity: number;
    price: number;
  }>;
}): Promise<{ order: any; lines: MovementLine[]; transaction: any }> =>
  apiWrapper(async () => {
    const res = await apiClient.post("/inventoryMovements", payload);
    return res.data;
  });
// Mise à jour d’une ligne
export const updateMovementLine = (
  uuid: string,
  line: Partial<Omit<MovementLine, "uuid">>
): Promise<MovementLine> =>
  apiWrapper(async () => {
    const res = await apiClient.put(`/inventoryMovements/lines/${uuid}`, line);
    return res.data;
  });

// Suppression d’une ligne
export const deleteMovementLine = (uuid: string): Promise<void> =>
  apiWrapper(async () => {
    await apiClient.delete(`/inventoryMovements/lines/${uuid}`);
  });
