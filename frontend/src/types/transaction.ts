// EASY-TRACABILITY: frontend/src/types/transaction.ts

export enum TransactionType {
  VENTE = "VENTE",
  ACHAT = "ACHAT",
}
export interface Transaction {
  uuid: string;
  transactionType: TransactionType;
  totalPrice: number;
  movementOrderUUID: string; // au lieu de inventoryMovementUUID
  createdAt: string;
  updatedAt?: string;
}
