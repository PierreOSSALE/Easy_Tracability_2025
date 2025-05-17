// EASY-TRACABILITY: frontend/src/types/transaction.ts

export enum TransactionType {
  VENTE = "VENTE",
  ACHAT = "ACHAT",
}
export interface Transaction {
  uuid: string;
  transactionType: TransactionType;
  totalPrice: number;
  inventoryMovementUUID: string;
  createdAt: string; // Date de création de la transaction
  updatedAt?: string; // Date de mise à jour (optionnel)
}
