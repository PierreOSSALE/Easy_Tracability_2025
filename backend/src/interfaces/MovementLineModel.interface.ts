//EASY-TRACABILITY: backend//src/interface/MouvementLineModel.interface.ts

export enum OperationType {
  ENTREE = "ENTREE",
  SORTIE = "SORTIE",
}

export interface IMovementLine {
  uuid: string;
  movementOrderUUID: string;
  productBarcode: string;
  operationType: OperationType;
  quantity: number;
}

export interface IMovementLineCreation {
  uuid?: string;
  movementOrderUUID: string;
  productBarcode: string;
  operationType: OperationType;
  quantity: number;
}

export interface IMovementLineUpdate {
  productBarcode?: string;
  operationType?: OperationType;
  quantity?: number;
}
