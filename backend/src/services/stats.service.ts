//EASY-TRACABILITY: backend/src/services/stats.service.ts

import {
  ProductModel,
  TransactionModel,
  MovementLineModel, // ← Ajouté
} from "../models/associations";

export class StatsService {
  async getOverview() {
    // 1) Nombre total de produits
    const totalProducts = await ProductModel.count();

    // 2) Somme des quantités IN (ENTREE) et OUT (SORTIE)
    const [totalInventoryIn, totalInventoryOut] = await Promise.all([
      MovementLineModel.sum("quantity", {
        where: { operationType: "ENTREE" },
      }),
      MovementLineModel.sum("quantity", {
        where: { operationType: "SORTIE" },
      }),
    ]);

    // 3) Nombre total de transactions
    const totalTransactions = await TransactionModel.count();

    // 4) Chiffre d’affaires (VENTE) et achats (ACHAT)
    const [totalSales, totalPurchases] = await Promise.all([
      TransactionModel.sum("totalPrice", {
        where: { transactionType: "VENTE" },
      }),
      TransactionModel.sum("totalPrice", {
        where: { transactionType: "ACHAT" },
      }),
    ]);

    return {
      totalProducts,
      totalInventoryIn: totalInventoryIn || 0,
      totalInventoryOut: totalInventoryOut || 0,
      totalTransactions,
      totalSales: totalSales || 0,
      totalPurchases: totalPurchases || 0,
    };
  }
}
