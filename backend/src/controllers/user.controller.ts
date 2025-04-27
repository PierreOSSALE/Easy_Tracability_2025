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

  // Recherche d'un utilisateur via l'UUID en utilisant le scope "byUUID"
  static async getUserById(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  // Récupération des utilisateurs selon leur rôle (utilise le scope "byRole")
  static async getUsersByRole(req: Request, res: Response): Promise<void> {
    const role = req.query.role as string;
    const userService = new UserService();
    const users = await userService.getUsersByRole(role);
    res.status(200).json(users);
  }

  // Recherche des utilisateurs par nom d'utilisateur (utilise le scope "byUsername")
  static async getUsersByUsername(req: Request, res: Response): Promise<void> {
    const username = req.query.username as string;
    const userService = new UserService();
    const users = await userService.getUsersByUsername(username);
    res.status(200).json(users);
  }

  // Modification d'un utilisateur (réservé aux Admins)
  static async updateUser(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    const user = await userService.updateUser(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  // Suppression d'un utilisateur (réservé aux Admins)
  static async deleteUser(req: Request, res: Response): Promise<void> {
    const userService = new UserService();
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  }

  // Mise à jour du profil personnel (email uniquement)
  static async updateProfile(req: Request, res: Response): Promise<void> {
    const userService = new UserService();

    // ⚡ Maintenant uniquement l'email modifiable
    const { email } = req.body;

    if (!email) {
      res
        .status(400)
        .json({ message: "Veuillez fournir un email à mettre à jour." });
      return;
    }

    const allowedUpdates = { email };

    const user = await userService.updateUser(req.params.id, allowedUpdates);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  }
}
