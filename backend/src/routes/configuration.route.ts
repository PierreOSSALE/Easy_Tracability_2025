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
router.post("/", authorizeRole(["Admin"]), catchAsync(createConfiguration));

router.get("/", authorizeRole(["Admin"]), catchAsync(getAllConfigurations));
router.put("/:name", authorizeRole(["Admin"]), catchAsync(updateConfiguration));

export default router;
