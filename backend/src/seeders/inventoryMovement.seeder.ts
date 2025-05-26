// EASY-TRACABILITY: backend/seeders/inventoryMovement.seeder.ts

import { MovementOrderModel } from "../models/movementOrder";
import { MovementLineModel } from "../models/movementLine";
import { OperationType } from "../interfaces/MovementLineModel.interface";

export async function seedInventoryMovements(
  userUUID: string,
  productBarcode: string
) {
  // 1️⃣ Création du ticket (MovementOrder) avec userUUID et date
  const now = new Date();
  const order = await MovementOrderModel.create({
    ticketId: `TICKET-${now.getTime()}`,
    userUUID,
    date: now,
  });

  // 2️⃣ Préparation des lignes sans userUUID ni date, mais avec movementOrderUUID
  const movements = [
    { operationType: OperationType.ENTREE, quantity: 100 },
    { operationType: OperationType.SORTIE, quantity: 20 },
    { operationType: OperationType.ENTREE, quantity: 50 },
    { operationType: OperationType.SORTIE, quantity: 30 },
    { operationType: OperationType.ENTREE, quantity: 70 },
  ].map((m, idx) => ({
    movementOrderUUID: order.uuid,
    productBarcode,
    operationType: m.operationType,
    quantity: m.quantity,
  }));

  // 3️⃣ Insertion en une seule passe
  const createdLines = await MovementLineModel.bulkCreate(movements, {
    returning: true,
  });

  console.log(
    `✅ Seeded order ${order.uuid} with ${createdLines.length} lines`
  );
  return { order, lines: createdLines };
}
