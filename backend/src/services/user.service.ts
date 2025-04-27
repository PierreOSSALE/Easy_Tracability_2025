//EASY-TRACABILITY: backend/src/services/user.service.ts

import bcrypt from "bcrypt";
import crypto from "crypto"; // pour générer token random sécurisé
import {
  IUser,
  IUserCreation,
  IUserUpdate,
} from "../interfaces/user.interface";
import { UserModel } from "../models/associations";
import { Op } from "sequelize";

export class UserService {
  async createUser(user: IUserCreation): Promise<IUser> {
    // Hacher le mot de passe reçu AVANT création en base
    const hashedPassword = await bcrypt.hash(user.hashedPassword, 10);

    const newUser = await UserModel.create({
      username: user.username,
      hashedPassword: hashedPassword,
      email: user.email,
      role: user.role,
    });

    return newUser.toJSON() as IUser;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await UserModel.findAll();
    return users.map((user) => user.toJSON() as IUser);
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await UserModel.scope({ method: ["byUUID", id] }).findOne();
    return user ? (user.toJSON() as IUser) : null;
  }

  async getUsersByRole(role: string): Promise<IUser[]> {
    const users = await UserModel.scope({ method: ["byRole", role] }).findAll();
    return users.map((user) => user.toJSON() as IUser);
  }

  async getUsersByUsername(username: string): Promise<IUser[]> {
    const users = await UserModel.scope({
      method: ["byUsername", username],
    }).findAll();
    return users.map((user) => user.toJSON() as IUser);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ where: { email } });
    return user ? (user.toJSON() as IUser) : null;
  }

  async updateUser(id: string, userData: IUserUpdate): Promise<IUser | null> {
    const user = await UserModel.scope({ method: ["byUUID", id] }).findOne();
    if (user) {
      await user.update(userData);
      return user.toJSON() as IUser;
    }
    return null;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await UserModel.scope({ method: ["byUUID", id] }).findOne();
    if (user) {
      await user.destroy();
    }
  }

  async requestPasswordReset(username: string): Promise<string> {
    const user = await UserModel.findOne({ where: { username } });
    if (!user) throw new Error("Utilisateur non trouvé");

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1h

    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await UserModel.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) throw new Error("Token invalide ou expiré");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      hashedPassword: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }
}
