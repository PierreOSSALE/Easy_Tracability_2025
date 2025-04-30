//EASY-TRACABILITY: backend/src/routes/configuration.route.ts

import { Router } from "express";
import {
  getAllConfigurations,
  updateConfiguration,
  createConfiguration,
} from "../controllers/configuration.controller";

import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

// Toutes les routes sont désormais sécurisées : hybridAuth obligatoire
router.use(hybridAuth);
// POST /api/configurations
router.post(
  "/",
  authorizeRole(["Administrateur"]),
  catchAsync(createConfiguration)
);

router.get(
  "/",
  authorizeRole(["Administrateur"]),
  catchAsync(getAllConfigurations)
);
router.put(
  "/:name",
  authorizeRole(["Administrateur"]),
  catchAsync(updateConfiguration)
);

export default router;
