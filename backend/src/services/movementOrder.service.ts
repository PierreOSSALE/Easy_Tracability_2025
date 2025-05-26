// backend/src/services/movementOrder.service.ts

import { MovementOrderModel } from "../models/associations";
import { IMovementOrderCreation } from "../interfaces/movementOrder.interface";

export class MovementOrderService {
  async createOrder(data: IMovementOrderCreation) {
    return await MovementOrderModel.create(data);
  }
}
