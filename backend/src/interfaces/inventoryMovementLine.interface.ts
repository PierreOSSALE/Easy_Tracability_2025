//EASY-TRACABILITY: backend//src/interface/inventoryMovementLine.interface.ts

import { OperationType } from "./MovementLineModel.interface";

export interface ILineCreation {
  uuid?: string;
  movementOrderUUID: string; // corrigé : correspond au champ de movementLine.ts
  productBarcode: string;
  operationType: OperationType;
  quantity: number;
}
