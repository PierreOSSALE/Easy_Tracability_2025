// EASY-TRACABILITY: backend/src/models/configuration.ts

// EASY-TRACABILITY: backend/src/models/configuration.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class ConfigurationInstance extends Model {
  declare uuid: string;
  declare parameterKey: string;
  declare parameterValue: string;
  declare lastModifiedBy?: string; // UUID utilisateur
  declare lastModifiedAt?: Date;
}

export const ConfigurationModel = ConfigurationInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    parameterKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parameterValue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastModifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lastModifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "configurations",
    timestamps: false,
  }
);
