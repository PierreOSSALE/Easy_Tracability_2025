// EASY-TRACABILITY: backend/src/models/configuration.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import {
  IConfiguration,
  IConfigurationCreation,
} from "../interfaces/configuration.interface";

export class ConfigurationInstance
  extends Model<IConfiguration, IConfigurationCreation>
  implements IConfiguration
{
  // Ces propriétés seront injectées par Sequelize au runtime
  declare uuid: string;
  declare parameterName: string;
  declare parameterValue: string;
  declare lastModifiedAt: Date;
  declare lastModifiedBy: string;
}

// Utilisation de Model.init pour définir le schéma du modèle
export const ConfigurationModel = ConfigurationInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    parameterName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parameterValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastModifiedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Modification réalisée ici : le type passe de STRING à UUID pour être compatible avec UserModel.uuid
    lastModifiedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize, // Instance importée depuis "../config/database"
    tableName: "configurations", // Nom de la table
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
  }
);
