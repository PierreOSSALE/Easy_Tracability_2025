// EASY-TRACABILITY:frontend/src/types/inventoryMovement.ts
export enum OperationType {
  ENTREE = "ENTREE",
  SORTIE = "SORTIE",
}

export interface MovementOrder {
  uuid: string;
  ticketId: string;
  userUUID: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
export interface NewMovementOrder {
  ticketId: string;
  userUUID: string;
  date?: string;
}

export interface MovementLine {
  uuid: string;
  movementOrderUUID: string;
  productBarcode: string;
  operationType: OperationType;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
