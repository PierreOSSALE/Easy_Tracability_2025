//EASY-TRACABILITY: backend/src/services/InventoryMovement.service.ts

import {
  IInventoryMovementCreation,
  IInventoryMovementUpdate,
} from "../interfaces/inventoryMovement.interface";
import { IInventoryMovementModel } from "../models/associations";

export class InventoryMovementService {
  async createMovement(data: IInventoryMovementCreation) {
    const movement = await IInventoryMovementModel.create(data);
    return movement;
  }

  async getAllMovements(
    filters: any = {},
    limit: number = 10,
    offset: number = 0
  ) {
    return await IInventoryMovementModel.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: ["transaction", "product", "user"],
      order: [["createdAt", "DESC"]],
    });
  }

  async getMovementById(uuid: string) {
    return await IInventoryMovementModel.scope({
      method: ["byUUID", uuid],
    }).findOne({
      include: ["transaction", "product", "user"],
    });
  }

  async updateMovement(uuid: string, data: IInventoryMovementUpdate) {
    const movement = await IInventoryMovementModel.scope({
      method: ["byUUID", uuid],
    }).findOne();
    if (!movement) throw new Error("InventoryMovement not found");

    await movement.update(data);
    return movement;
  }

  async deleteMovement(uuid: string) {
    const movement = await IInventoryMovementModel.scope({
      method: ["byUUID", uuid],
    }).findOne();
    if (!movement) throw new Error("InventoryMovement not found");

    await movement.destroy();
    return { message: "InventoryMovement deleted successfully" };
  }

  async getRecentMovements(limit: number = 10) {
    return await IInventoryMovementModel.scope({
      method: ["recent", limit],
    }).findAll({
      include: ["transaction", "product", "user"],
    });
  }

  async getMovementsByOperation(operationType: string) {
    return await IInventoryMovementModel.scope({
      method: ["byOperation", operationType],
    }).findAll({
      include: ["transaction", "product", "user"],
    });
  }
}
