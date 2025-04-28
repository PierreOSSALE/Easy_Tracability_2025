//EASY-TRACABILITY: backend/src/controllers/user.controller.ts

import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const { uuid } = req.params; // ✅ Utilisation de uuid
    const user = await userService.getUserById(uuid);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  static async getUsersByRole(req: Request, res: Response): Promise<void> {
    const role = req.query.role as string;
    const userService = new UserService();
    const users = await userService.getUsersByRole(role);
    res.status(200).json(users);
  }

  static async getUsersByUsername(req: Request, res: Response): Promise<void> {
    const username = req.query.username as string;
    const userService = new UserService();
    const users = await userService.getUsersByUsername(username);
    res.status(200).json(users);
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const { uuid } = req.params; // ✅ Utilisation de uuid
    const user = await userService.updateUser(uuid, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const { uuid } = req.params; // ✅ Utilisation de uuid
    await userService.deleteUser(uuid);
    res.status(204).send();
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const { uuid } = req.params; // ✅ Utilisation de uuid
    const { email } = req.body;

    if (!email) {
      res
        .status(400)
        .json({ message: "Veuillez fournir un email à mettre à jour." });
      return;
    }

    const allowedUpdates = { email };

    const user = await userService.updateUser(uuid, allowedUpdates);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  }
}
