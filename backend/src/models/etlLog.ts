// backend/src/models/etlLog.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class ETLLogInstance extends Model {
  declare id: number;
  declare runDate: Date;
  declare status: "SUCCESS" | "FAILURE";
  declare rowsExtracted: number;
  declare rowsLoaded: number;
  declare errorMessage?: string;
}

export const ETLLogModel = ETLLogInstance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    runDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("SUCCESS", "FAILURE"),
      allowNull: false,
    },
    rowsExtracted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rowsLoaded: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "etl_logs",
    timestamps: false,
  }
);
