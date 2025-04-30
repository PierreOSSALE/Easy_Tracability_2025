//EASY-TRACABILITY: backend/src/routes/inventoryMovement.route.ts

import { Router } from "express";
import { InventoryMovementController } from "../controllers/inventoryMovement.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

router.use(hybridAuth);

// -------------------------
// Routes protégées
// -------------------------

// Lire tous les mouvements
router.get(
  "/",
  catchAsync(InventoryMovementController.getAllInventoryMovements)
);

// Lire mouvements récents
router.get(
  "/recent",
  catchAsync(InventoryMovementController.getRecentInventoryMovements)
);

// Lire par type opération (ENTREE/SORTIE)
router.get(
  "/by-operation",
  catchAsync(InventoryMovementController.getInventoryMovementsByOperation)
);

// Export CSV
router.get(
  "/export",
  catchAsync(InventoryMovementController.exportInventoryMovementsCSV)
);

// Lire mouvement par UUID
router.get(
  "/:uuid",
  catchAsync(InventoryMovementController.getInventoryMovementById)
);

// Créer mouvement (Opérateur + Gestionnaire + Admin)
router.post(
  "/",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(InventoryMovementController.createInventoryMovement)
);

// Modifier mouvement (Gestionnaire + Admin)
router.put(
  "/:uuid",
  authorizeRole(["Administrateur", "Gestionnaire"]),
  catchAsync(InventoryMovementController.updateInventoryMovement)
);

// Supprimer mouvement (Admin seulement)
router.delete(
  "/:uuid",
  authorizeRole(["Administrateur"]),
  catchAsync(InventoryMovementController.deleteInventoryMovement)
);

export default router;
