// EASY-TRACABILITY:frontend/src/types/inventoryMovement.ts
export enum OperationType {
  ENTREE = "ENTREE",
  SORTIE = "SORTIE",
}
export interface InventoryMovement {
  uuid: string;
  productBarcode: string;
  userUUID: string;
  date: Date;
  operationType: OperationType;
  quantity: number;
}
export type NewInventoryMovement = {
  productBarcode: string;
  date: Date;
  operationType: OperationType;
  quantity: number;
};
