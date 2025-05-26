//EASY-TRACABILITY: backend/src/interface/transaction.interface.ts

export enum TransactionType {
  VENTE = "VENTE",
  ACHAT = "ACHAT",
}

export interface ITransaction {
  uuid: string;
  transactionType: TransactionType;
  totalPrice: number;
  movementOrderUUID: string;
}

export interface ITransactionCreation {
  uuid?: string;
  transactionType: TransactionType;
  totalPrice: number;
  movementOrderUUID: string;
}

export interface ITransactionUpdate {
  transactionType?: TransactionType;
  totalPrice?: number;
  movementOrderUUID?: string;
}
