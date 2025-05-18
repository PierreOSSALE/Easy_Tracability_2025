// EASY-TRACABILITY:frontend/src/services/inventoryMovement.service.ts

import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import {
  InventoryMovement,
  NewInventoryMovement,
} from "../types/inventoryMovement";

// Obtenir tous les mouvements
export interface InventoryMovementPaginated {
  count: number;
  rows: InventoryMovement[];
}

export const fetchInventoryMovements =
  (): Promise<InventoryMovementPaginated> => {
    return apiWrapper(async () => {
      const res = await apiClient.get("/inventoryMovements");
      return res.data;
    });
  };

// Obtenir les mouvements récents
export const fetchRecentInventoryMovements = (): Promise<
  InventoryMovement[]
> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/inventoryMovements/recent");
    return res.data;
  });
};

// Obtenir les mouvements par type d’opération
export const fetchInventoryMovementsByOperation = (
  operationType: "ENTREE" | "SORTIE"
): Promise<InventoryMovement[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/inventoryMovements/by-operation", {
      params: { operationType },
    });
    return res.data;
  });
};

// Exporter les mouvements en CSV
export const exportInventoryMovementsCSV = (): Promise<Blob> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/inventoryMovements/export", {
      responseType: "blob",
    });
    return res.data;
  });
};

// Obtenir un mouvement par UUID
export const getInventoryMovementById = (
  uuid: string
): Promise<InventoryMovement> => {
  return apiWrapper(async () => {
    const res = await apiClient.get(`/inventoryMovements/${uuid}`);
    return res.data;
  });
};

// Créer un mouvement
export const createInventoryMovement = (
  movement: NewInventoryMovement
): Promise<InventoryMovement> => {
  return apiWrapper(async () => {
    const res = await apiClient.post("/inventoryMovements", movement);
    return res.data;
  });
};

// Mettre à jour un mouvement
export const updateInventoryMovement = (
  uuid: string,
  movement: Partial<Omit<InventoryMovement, "uuid">>
): Promise<InventoryMovement> => {
  return apiWrapper(async () => {
    const res = await apiClient.put(`/inventoryMovements/${uuid}`, movement);
    return res.data;
  });
};

// Supprimer un mouvement
export const deleteInventoryMovement = (uuid: string): Promise<void> => {
  return apiWrapper(async () => {
    await apiClient.delete(`/inventoryMovements/${uuid}`);
  });
};
