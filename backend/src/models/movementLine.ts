// EASY-TRACABILITY: backend/src/models/MovementLine.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import {
  OperationType,
  IMovementLine,
  IMovementLineCreation,
} from "../interfaces/MovementLineModel.interface";

export class MovementLineInstance
  extends Model<IMovementLine, IMovementLineCreation>
  implements IMovementLine
{
  declare uuid: string;
  declare movementOrderUUID: string;
  declare productBarcode: string;
  declare operationType: OperationType;
  declare quantity: number;
}

export const MovementLineModel = MovementLineInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    movementOrderUUID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "movement_orders", key: "uuid" },
    },
    productBarcode: {
      type: DataTypes.STRING(13),
      allowNull: false,
      references: { model: "products", key: "barcode" },
    },
    operationType: {
      type: DataTypes.ENUM(...Object.values(OperationType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(OperationType)],
          msg: `Le type d'opération doit être l'un des suivants : ${Object.values(
            OperationType
          ).join(", ")}`,
        },
        notEmpty: {
          msg: "Le type d'opération ne peut pas être vide.",
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "La quantité doit être un entier.",
        },
        min: {
          args: [1],
          msg: "La quantité doit être au moins 1.",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "movement_lines",
    timestamps: true,
    scopes: {
      byUUID(uuid: string) {
        return { where: { uuid } };
      },
      recent(limit: number = 10) {
        return { order: [["createdAt", "DESC"]], limit };
      },
      byOperation(type: string) {
        return { where: { operationType: type } };
      },
      byOrderUUID(orderUUID: string) {
        return { where: { movementOrderUUID: orderUUID } };
      },
    },
  }
);
