// EASY-TRACABILITY: backend/src/models/transaction.ts

import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../config/database";
import {
  ITransaction,
  ITransactionCreation,
  TransactionType,
} from "../interfaces/transaction.interface";

export class TransactionInstance
  extends Model<ITransaction, ITransactionCreation>
  implements ITransaction
{
  declare uuid: string;
  declare transactionType: TransactionType;
  declare totalPrice: number;
  declare inventoryMovementUUID: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export const TransactionModel = TransactionInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    inventoryMovementUUID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "inventory_movements",
        key: "uuid",
      },
    },
    transactionType: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(TransactionType)],
          msg: "Le type de transaction est invalide",
        },
        isEmpty(value: string) {
          if (typeof value !== "string" || value.trim() === "") {
            throw new Error("Le type de transaction ne peut pas être vide.");
          }
        },
      },
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        isPositive(value: number) {
          if (value <= 0) {
            throw new Error("Le prix total doit être supérieur à zéro.");
          }
        },
      },
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
    scopes: {
      byUUID(uuid: string) {
        return {
          where: { uuid },
        };
      },
      byTransactionType(type: TransactionType) {
        return {
          where: { transactionType: type },
        };
      },
      byInventoryMovement(uuid: string) {
        return {
          where: { inventoryMovementUUID: uuid },
        };
      },
      recent(limit: number = 10) {
        return {
          order: [["createdAt", "DESC"]],
          limit,
        };
      },
    },
  }
);
