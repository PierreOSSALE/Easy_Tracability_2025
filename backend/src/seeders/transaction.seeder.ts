// backend/seeders/transaction.seeder.ts
import { TransactionModel } from "../models/associations";
import { TransactionType } from "../interfaces/transaction.interface";

export async function seedTransactions(orderUUID: string) {
  const transactions = [
    {
      movementOrderUUID: orderUUID, // ← on passe bien l'UUID de l'ordre
      transactionType: TransactionType.ACHAT,
      totalPrice: 350.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await TransactionModel.bulkCreate(transactions);
  console.log("✅ Transactions seeded");
}
