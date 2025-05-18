//EASY-TRACABILITY: backend//src/interface/inventoryMovement.interface.ts

export enum OperationType {
  ENTREE = "ENTREE",
  SORTIE = "SORTIE",
}

export interface IInventoryMovement {
  uuid: string;
  productBarcode: string;
  userUUID: string;
  date: Date;
  operationType: OperationType;
  quantity: number;
}

export interface IInventoryMovementCreation {
  uuid?: string;
  productBarcode: string;
  userUUID: string;
  date: Date;
  operationType: OperationType;
  quantity: number;
}

export interface IInventoryMovementUpdate {
  productBarcode?: string;
  userUUID?: string;
  date?: Date;
  operationType?: OperationType;
  quantity?: number;
}
