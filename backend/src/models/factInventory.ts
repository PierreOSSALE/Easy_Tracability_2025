// backend/src/models/factInventory.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class FactInventoryInstance extends Model {
  declare uuid: string;
  declare productUUID: string;
  declare timeUUID: string;
  declare userUUID: string;
  declare movementLineUUID?: string;
  declare quantity: number;
  declare totalPrice: number;
}

export const FactInventoryModel = FactInventoryInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    productUUID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "dim_products", key: "uuid" },
    },
    timeUUID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "dim_time", key: "uuid" },
    },
    userUUID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "dim_users", key: "uuid" },
    },
    movementLineUUID: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "movement_lines", // <-- nom exact DE VOTRE table Sequelize MovementLine
        key: "uuid",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "fact_inventory",
    timestamps: false,
  }
);
