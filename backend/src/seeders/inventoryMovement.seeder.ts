// EASY-TRACABILITY: backend/seeders/inventoryMovement.seeder.ts

import { IInventoryMovementModel } from "../models/associations";
import { OperationType } from "../interfaces/inventoryMovement.interface";

export async function seedInventoryMovements(
  userUUID: string,
  productUUID: string
) {
  const now = new Date();
  const oneMinuteLater = new Date(now.getTime() + 60000); // +1 minute
  const twoMinutesLater = new Date(now.getTime() + 120000); // +2 minutes
  const threeMinutesLater = new Date(now.getTime() + 180000); // +3 minutes
  const fourMinutesLater = new Date(now.getTime() + 240000); // +4 minutes

  const movements = [
    {
      userUUID,
      productUUID,
      date: now,
      operationType: OperationType.ENTREE,
      quantity: 100,
    },
    {
      userUUID,
      productUUID,
      date: oneMinuteLater,
      operationType: OperationType.SORTIE,
      quantity: 20,
    },
    {
      userUUID,
      productUUID,
      date: twoMinutesLater,
      operationType: OperationType.ENTREE,
      quantity: 50,
    },
    {
      userUUID,
      productUUID,
      date: threeMinutesLater,
      operationType: OperationType.SORTIE,
      quantity: 30,
    },
    {
      userUUID,
      productUUID,
      date: fourMinutesLater,
      operationType: OperationType.ENTREE,
      quantity: 70,
    },
  ];

  const createdMovements = await IInventoryMovementModel.bulkCreate(movements, {
    returning: true,
  });

  console.log("✅ Inventory movements seeded");
  return createdMovements;
}
