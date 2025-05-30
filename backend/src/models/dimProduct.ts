// backend/src/models/dimProduct.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class DimProductInstance extends Model {
  declare uuid: string;
  declare name: string;
  declare barcode: string;
}

export const DimProductModel = DimProductInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING(13),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "dim_products",
    timestamps: false,
  }
);
