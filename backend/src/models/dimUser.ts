// backend/src/models/dimUser.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { UserRole } from "../interfaces/user.interface";

export class DimUserInstance extends Model {
  declare uuid: string;
  declare username: string;
  declare role: UserRole;
  declare email: string;
}

export const DimUserModel = DimUserInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "dim_users",
    timestamps: false,
  }
);
