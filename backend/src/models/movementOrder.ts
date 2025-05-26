// EASY-TRACABILITY: backend/src/models/MovementOrder.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import {
  IMovementOrder,
  IMovementOrderCreation,
} from "../interfaces/movementOrder.interface";

export class MovementOrderInstance
  extends Model<IMovementOrder, IMovementOrderCreation>
  implements IMovementOrder
{
  declare uuid: string;
  declare ticketId: string;
  declare userUUID: string;
  declare date: Date;
}

export const MovementOrderModel = MovementOrderInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ticketId: { type: DataTypes.STRING, allowNull: false },
    userUUID: { type: DataTypes.UUID, allowNull: false },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "movement_orders", timestamps: true }
);
