// backend/src/models/dimTime.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class DimTimeInstance extends Model {
  declare uuid: string;
  declare date: Date;
  declare dayOfWeek: number;
  declare month: number;
  declare year: number;
}

export const DimTimeModel = DimTimeInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    month: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "dim_time",
    timestamps: false,
  }
);
