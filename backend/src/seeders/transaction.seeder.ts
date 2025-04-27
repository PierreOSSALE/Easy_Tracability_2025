// backend/seeders/transaction.seeder.ts
import { TransactionModel } from "../models/transaction";
import { IInventoryMovementModel } from "../models/inventoryMovement";
import { TransactionType } from "../interfaces/transaction.interface";

export async function seedTransactions() {
  const movements = await IInventoryMovementModel.findAll();

  const transactions = movements.map((movement) => ({
    uuid: movement.uuid, // même UUID que InventoryMovement
    transactionType:
      Math.random() > 0.5 ? TransactionType.VENTE : TransactionType.ACHAT,
    totalPrice: Math.round(Math.random() * 100 * 100) / 100, // aléatoire, format prix
  }));

  await TransactionModel.bulkCreate(transactions);
  console.log("✅ Transactions seeded");
}
