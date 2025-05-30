// EASY-TRACABILITY: frontend/src/types/factInventory.ts

export interface FactInventory {
  uuid: string;
  productUUID: string;
  timeUUID: string;
  userUUID: string;
  movementLineUUID?: string;
  quantity: number;
  totalPrice: number;
}
