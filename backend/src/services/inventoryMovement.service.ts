//EASY-TRACABILITY: backend/src/services/InventoryMovement.service.ts

import {
  IMovementLineUpdate,
  OperationType,
} from "../interfaces/MovementLineModel.interface";
import {
  IMovementLine,
  IMovementLineCreation,
} from "../interfaces/MovementLineModel.interface";
import {
  ITransactionCreation,
  TransactionType,
} from "../interfaces/transaction.interface";
import { MovementOrderService } from "./movementOrder.service";
import {
  MovementOrderModel,
  MovementLineModel,
  TransactionModel,
  ProductModel,
  UserModel,
} from "../models/associations";

const movementOrderService = new MovementOrderService();

export class InventoryMovementService {
  async createMovement(payload: {
    ticketId: string;
    userUUID: string;
    date?: string;
    lines: Array<{
      productBarcode: string;
      operationType: OperationType;
      quantity: number;
      price: number;
    }>;
  }) {
    const { ticketId, userUUID, date, lines } = payload;
    // 1️⃣ Créer l'ordre
    const order = await movementOrderService.createOrder({
      ticketId,
      userUUID,
      date: date ? new Date(date) : new Date(),
    });

    // 2️⃣ Créer les lignes de mouvement
    const createdLines = await Promise.all(
      lines.map(
        (l): Promise<IMovementLine> =>
          MovementLineModel.create({
            movementOrderUUID: order.uuid,
            productBarcode: l.productBarcode,
            operationType: l.operationType,
            quantity: l.quantity,
          } as IMovementLineCreation)
      )
    );

    // 3️⃣ Mettre à jour le stock des produits
    await Promise.all(
      lines.map((l) =>
        ProductModel.decrement(
          {
            stockQuantity:
              l.operationType === OperationType.SORTIE
                ? l.quantity
                : -l.quantity,
          },
          { where: { barcode: l.productBarcode } }
        )
      )
    );

    // 4️⃣ Créer la transaction globale
    const totalPrice = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
    const txData: ITransactionCreation = {
      movementOrderUUID: order.uuid,
      transactionType: TransactionType.VENTE,
      totalPrice,
    };
    const transaction = await TransactionModel.create(txData);

    return { order, lines: createdLines, transaction };
  }

  async getAllMovements(
    filters: any = {},
    limit: number = 10,
    offset: number = 0
  ) {
    return await MovementLineModel.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        {
          model: MovementOrderModel,
          as: "order",
          include: [
            { model: TransactionModel, as: "transaction" },
            { model: UserModel, as: "user" },
          ],
        },
        { model: ProductModel, as: "product" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getMovementById(uuid: string) {
    return await MovementLineModel.scope({ method: ["byUUID", uuid] }).findOne({
      include: [
        {
          model: MovementOrderModel,
          as: "order",
          include: [
            { model: TransactionModel, as: "transaction" },
            { model: UserModel, as: "user" },
          ],
        },
        { model: ProductModel, as: "product" },
      ],
    });
  }

  async updateMovement(uuid: string, data: IMovementLineUpdate) {
    const movement = await MovementLineModel.scope({
      method: ["byUUID", uuid],
    }).findOne();
    if (!movement) throw new Error("InventoryMovement not found");

    await movement.update(data);
    return movement;
  }

  async deleteMovement(uuid: string) {
    const movement = await MovementLineModel.scope({
      method: ["byUUID", uuid],
    }).findOne();
    if (!movement) throw new Error("InventoryMovement not found");

    await movement.destroy();
    return { message: "InventoryMovement deleted successfully" };
  }

  async getRecentMovements(limit: number = 10) {
    return await MovementLineModel.scope({ method: ["recent", limit] }).findAll(
      {
        include: [
          {
            model: MovementOrderModel,
            as: "order",
            include: [
              { model: TransactionModel, as: "transaction" },
              { model: UserModel, as: "user" },
            ],
          },
          { model: ProductModel, as: "product" },
        ],
      }
    );
  }

  async getMovementsByOperation(operationType: string) {
    return await MovementLineModel.scope({
      method: ["byOperation", operationType],
    }).findAll({
      include: [
        {
          model: MovementOrderModel,
          as: "order",
          include: [
            { model: TransactionModel, as: "transaction" },
            { model: UserModel, as: "user" },
          ],
        },
        { model: ProductModel, as: "product" },
      ],
    });
  }
}
