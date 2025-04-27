//EASY-TRACABILITY: backend/src/routes/user.route.ts

import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

// Toutes les routes sont désormais sécurisées : hybridAuth obligatoire
router.use(hybridAuth);

// Route pour rechercher des utilisateurs par nom d'utilisateur (accessible à tous les connectés)
// Exemple : GET /users/search?username=john
router.get(
  "/search",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.getUsersByUsername)
);
// Route pour filtrer les utilisateurs par rôle (accessible à tous les connectés)
// Exemple : GET /users/role?role=Admin
router.get(
  "/role",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.getUsersByRole)
);

// Route pour récupérer tous les utilisateurs (accessible à tous les connectés)
// Exemple : GET /users
router.get(
  "/",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.getAllUsers)
);

// Route pour récupérer un utilisateur par son UUID (accessible à tous les connectés)
// Exemple : GET /users/:id
router.get("/:id", catchAsync(UserController.getUserById));

// Route pour créer un nouvel utilisateur (réservé aux Admins)
// Exemple : POST /users
router.post(
  "/",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.createUser)
);

// Route pour mettre à jour un utilisateur existant (réservé aux Admins)
// Exemple : PUT /users/:id
router.put(
  "/:id",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.updateUser)
);

// Route pour supprimer un utilisateur (réservé aux Admins)
// Exemple : DELETE /users/:id
router.delete(
  "/:id",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.deleteUser)
);

export default router;
