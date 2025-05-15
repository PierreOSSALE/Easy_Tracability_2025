// EASY-TRACABILITY:frontend/src/services/transaction.service.ts

import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import { Transaction } from "../types/transaction";

// Obtenir toutes les transactions
export const fetchAllTransactions = (): Promise<Transaction[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/transactions");
    return res.data;
  });
};

// Obtenir une transaction par UUID
export const fetchTransactionByUUID = (uuid: string): Promise<Transaction> => {
  return apiWrapper(async () => {
    const res = await apiClient.get(`/transactions/${uuid}`);
    return res.data;
  });
};

// Créer une transaction
export const createTransaction = (
  transaction: Omit<Transaction, "uuid">
): Promise<Transaction> => {
  return apiWrapper(async () => {
    const res = await apiClient.post("/transactions", transaction);
    return res.data;
  });
};

// Mettre à jour une transaction
export const updateTransaction = (
  uuid: string,
  transaction: Partial<Omit<Transaction, "uuid">>
): Promise<Transaction> => {
  return apiWrapper(async () => {
    const res = await apiClient.put(`/transactions/${uuid}`, transaction);
    return res.data;
  });
};

// Supprimer une transaction
export const deleteTransaction = (uuid: string): Promise<void> => {
  return apiWrapper(async () => {
    await apiClient.delete(`/transactions/${uuid}`);
  });
};

// Exporter les transactions au format CSV
export const exportTransactionsCSV = (): Promise<Blob> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/transactions/export/csv", {
      responseType: "blob",
    });
    return res.data;
  });
};

// Générer une facture pour une transaction
export const generateTransactionInvoice = (uuid: string): Promise<Blob> => {
  return apiWrapper(async () => {
    const res = await apiClient.get(`/transactions/${uuid}/invoice`, {
      responseType: "blob",
    });
    return res.data;
  });
};
