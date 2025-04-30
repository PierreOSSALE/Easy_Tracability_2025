// EASY-TRACABILITY: backend/seeders/inventoryMovement.seeder.ts

import { IInventoryMovementModel } from "../models/associations";
import { OperationType } from "../interfaces/inventoryMovement.interface";

export async function seedInventoryMovements(
  userUUID: string,
  productUUID: string
) {
  const now = new Date();
  const oneMinuteLater = new Date(now.getTime() + 60000); // 1 min après

  const movements = [
    {
      userUUID,
      productUUID,
      date: now,
      operationType: OperationType.ENTREE,
      quantity: 50,
    },
    {
      userUUID,
      productUUID,
      date: oneMinuteLater,
      operationType: OperationType.SORTIE,
      quantity: 10,
    },
  ];

  const createdMovements = await IInventoryMovementModel.bulkCreate(movements, {
    returning: true,
  });

  console.log("✅ Inventory movements seeded");

  return createdMovements;
}
