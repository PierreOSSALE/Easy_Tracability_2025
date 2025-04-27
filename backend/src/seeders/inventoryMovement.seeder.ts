// backend/seeders/inventoryMovement.seeder.ts
import { IInventoryMovementModel } from "../models/inventoryMovement";
import { OperationType } from "../interfaces/inventoryMovement.interface";

export async function seedInventoryMovements(
  userUUID: string,
  productUUID: string
) {
  const movements = [
    {
      userUUID,
      productUUID,
      date: new Date(),
      operationType: OperationType.ENTREE,
      quantity: 50,
    },
    {
      userUUID,
      productUUID,
      date: new Date(),
      operationType: OperationType.SORTIE,
      quantity: 10,
    },
  ];

  await IInventoryMovementModel.bulkCreate(movements);
  console.log("✅ Inventory movements seeded");
}
