// EASY-TRACABILITY: backend/src/models/inventoryMovement.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import {
  IInventoryMovement,
  IInventoryMovementCreation,
  OperationType,
} from "../interfaces/inventoryMovement.interface";
import { ProductModel } from "./product";

export class InventoryMovementInstance
  extends Model<IInventoryMovement, IInventoryMovementCreation>
  implements IInventoryMovement
{
  // Le mot-clé "declare" informe TypeScript que ces propriétés seront injectées par Sequelize dans le runtime
  declare uuid: string;
  declare productBarcode: string;
  declare userUUID: string;
  declare date: Date;
  declare operationType: OperationType;
  declare quantity: number;
}

// Utilisation de Model.init pour définir le schéma du modèle et le lier à l'instance de connexion à la base de données
export const IInventoryMovementModel = InventoryMovementInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    productBarcode: {
      type: DataTypes.STRING(13),
      allowNull: false,

      references: {
        model: ProductModel,
        key: "barcode",
      },
    },
    userUUID: {
      type: DataTypes.UUID,
      allowNull: true,
      validate: {
        isEmpty: (value: string) => {
          if (value == null) {
            throw new Error("L'UUID de l'utilisateur ne peut pas être vide.");
          }
        },
      },
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    operationType: {
      type: DataTypes.ENUM(...Object.values(OperationType)), // Enum pour le type d'opération
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(OperationType)], // Validation pour s'assurer que le type d'opération est valide
          msg: `Le type d'opération doit être l'un des suivants : ${Object.values(
            OperationType
          ).join(", ")}`,
        },
        isEmpty: (value: OperationType) => {
          if (value == null) {
            throw new Error("Le type d'opération ne peut pas être vide.");
          }
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true, // Validation pour s'assurer que la quantité est un entier
        isEmpty: (value: number) => {
          if (value === 0) {
            throw new Error("La quantité ne peut pas être vide.");
          }
        },
      },
    },
  },
  {
    sequelize, // Instance importée depuis "../config/database"
    tableName: "inventory_movements", // Nom de la table
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
    // Scopes pour les requêtes
    scopes: {
      byUUID(uuid: string) {
        // Scope pour filtrer par UUID
        return {
          where: {
            uuid: uuid,
          },
        };
      },
      recent(limit: number = 10) {
        // Scope pour obtenir les mouvements récents
        return {
          order: [["createdAt", "DESC"]],
          limit,
        };
      },
      byOperation(type: string) {
        // Scope pour filtrer par type d'opération
        return {
          where: {
            operationType: type,
          },
        };
      },
      byBarcode(barcode: string) {
        return { where: { productBarcode: barcode } };
      },
    },
  }
);
