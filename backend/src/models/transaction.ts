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
  // Le mot-clé "declare" informe TypeScript que ces propriétés seront injectées par Sequelize dans le runtime
  declare uuid: string;
  declare transactionType: TransactionType;
  declare totalPrice: number;
}

// Utilisation de Model.init pour définir le schéma du modèle et le lier à l'instance de connexion à la base de données
export const TransactionModel = TransactionInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    transactionType: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(TransactionType)],
          msg:
            "Le type de transaction doit être l'un des suivants : " +
            Object.values(TransactionType).join(", "),
        },
        isEmpty(value: string) {
          if (value.trim() === "") {
            throw new Error("Le type de transaction ne peut pas être vide.");
          }
        },
      },
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true, // Validation pour s'assurer que c'est un nombre à virgule flottante
        isEmpty: (value: string) => {
          if (value.trim() === "") {
            throw new Error("Le prix total ne peut pas être vide.");
          }
        },
        isPositive(value: number) {
          if (value <= 0) {
            throw new Error("Le prix total doit être supérieur à zéro.");
          }
        },
      },
    },
  },
  {
    sequelize, // Instance importée depuis "../config/database"
    tableName: "transactions", // Nom de la table
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
    scopes: {
      byUUID(uuid: string) {
        // Scope pour filtrer par UUID
        return {
          where: {
            uuid: uuid,
          },
        };
      },
      byTransactionType(transactionType: TransactionType) {
        // Scope pour filtrer par type de transaction
        return {
          where: {
            transactionType: transactionType,
          },
        };
      },
      byTotalPrice(totalPrice: number) {
        // Scope pour filtrer par prix total
        return {
          where: {
            totalPrice: totalPrice,
          },
        };
      },
      byDateRange(startDate: Date, endDate: Date) {
        // Scope pour filtrer par plage de dates
        return {
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
        };
      },
      recent(limit: number = 10) {
        // Scope pour obtenir les transactions récentes
        return {
          order: [["createdAt", "DESC"]],
          limit,
        };
      },
    },
  }
);
