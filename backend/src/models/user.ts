// EASY-TRACABILITY: backend/src/models/user.ts

import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../config/database";
import { IUser, IUserCreation, UserRole } from "../interfaces/user.interface";

export class UserInstance extends Model<IUser, IUserCreation> implements IUser {
  // Le mot-clé "declare" informe TypeScript que ces propriétés seront injectées par Sequelize dans le runtime
  declare uuid: string;
  declare username: string;
  declare hashedPassword: string;
  declare role: UserRole;
  declare email: string;
}

// Utilisation de Model.init pour définir le schéma du modèle et le lier à l'instance de connexion à la base de données
export const UserModel = UserInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 20], // Longueur minimale et maximale du nom d'utilisateur
        isEmpty(value: string) {
          if (value.trim() === "") {
            throw new Error("Le nom d'utilisateur ne peut pas être vide.");
          }
        },
      },
      unique: true, // Assure l'unicité du nom d'utilisateur
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100], // Longueur minimale et maximale du mot de passe
        isEmpty(value: string) {
          if (value.trim() === "") {
            throw new Error("Le mot de passe ne peut pas être vide.");
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Format d'email invalide.",
        },
      },
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(UserRole)],
          msg:
            "Le rôle doit être l'un des suivants : " +
            Object.values(UserRole).join(", "),
        },
      },
    },
    profilePicture: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      field:
        process.env.SEQ_UNDERSCORED === "true"
          ? "profilePicture"
          : "profilePicture",
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize, // Instance importée depuis "../config/database"
    tableName: "users", // Nom de la table
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

      byRole(role: string) {
        // Scope pour filtrer par rôle
        return {
          where: {
            role: role,
          },
        };
      },
      byUsername(username: string) {
        // Scope pour filtrer par nom d'utilisateur
        return {
          where: {
            username: {
              [Op.like]: `%${username}%`, // Utilisation de l'opérateur LIKE pour la recherche partielle
            },
          },
        };
      },
    },
  }
);
