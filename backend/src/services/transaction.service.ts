//EASY-TRACABILITY: backend/src/services/transaction.service.ts

import { TransactionModel } from "../models/associations";
import {
  ITransactionCreation,
  ITransactionUpdate,
} from "../interfaces/transaction.interface";

export class TransactionService {
  async createTransaction(data: ITransactionCreation) {
    // ⚠️ Vérifie que inventoryMovementUUID est bien présent (foreign key obligatoire)
    if (!data.movementOrderUUID) {
      throw new Error("Le champ 'inventoryMovementUUID' est requis.");
    }

    return await TransactionModel.create(data);
  }

  async getAllTransactions(
    filters: any = {},
    limit: number = 10,
    offset: number = 0
  ) {
    return await TransactionModel.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async getTransactionById(uuid: string) {
    if (!uuid) throw new Error("UUID invalide ou manquant");

    return await TransactionModel.scope({
      method: ["byUUID", uuid],
    }).findOne();
  }

  async updateTransaction(uuid: string, data: ITransactionUpdate) {
    if (!uuid) throw new Error("UUID invalide ou manquant");

    const transaction = await TransactionModel.scope({
      method: ["byUUID", uuid],
    }).findOne();

    if (!transaction) throw new Error("Transaction non trouvée");

    await transaction.update(data);
    return transaction;
  }

  async deleteTransaction(uuid: string) {
    if (!uuid) throw new Error("UUID invalide ou manquant");

    const transaction = await TransactionModel.scope({
      method: ["byUUID", uuid],
    }).findOne();

    if (!transaction) throw new Error("Transaction non trouvée");

    await transaction.destroy();
    return { message: "Transaction supprimée avec succès" };
  }
}
