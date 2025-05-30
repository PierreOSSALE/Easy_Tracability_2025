// backend/src/interfaces/factInventory.interface.ts

export interface IFactInventory {
  uuid: string;
  productUUID: string; // FK vers DimProduct
  timeUUID: string; // FK vers DimTime
  userUUID: string; // FK vers DimUser
  movementLineUUID?: string; // FK vers InventoryMovement (staging), optionnel
  quantity: number;
  totalPrice: number;
}
