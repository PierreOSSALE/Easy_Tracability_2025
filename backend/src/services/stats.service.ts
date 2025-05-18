//EASY-TRACABILITY: backend/src/services/stats.service.ts

import {
  IInventoryMovementModel,
  ProductModel,
  TransactionModel,
} from "../models/associations";
import { Op } from "sequelize";

export class StatsService {
  async getOverview() {
    // 1) Nombre total de produits
    const totalProducts = await ProductModel.count();

    // 2) Somme des quantités IN (ENTREE) et OUT (SORTIE)
    const [totalInventoryIn, totalInventoryOut] = await Promise.all([
      IInventoryMovementModel.sum("quantity", {
        where: { operationType: "ENTREE" },
      }),
      IInventoryMovementModel.sum("quantity", {
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
