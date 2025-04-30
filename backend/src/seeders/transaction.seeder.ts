// backend/seeders/transaction.seeder.ts

import { TransactionModel } from "../models/associations";
import { TransactionType } from "../interfaces/transaction.interface";

export async function seedTransactions(inventoryMovementUUID: string) {
  const transactions = [
    {
      inventoryMovementUUID, // ✅ nouveau champ
      transactionType: TransactionType.ACHAT,
      totalPrice: 350.0,
    },
  ];

  await TransactionModel.bulkCreate(transactions);
  console.log("✅ Transactions seeded");
}
