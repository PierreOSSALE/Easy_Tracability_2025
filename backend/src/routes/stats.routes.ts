//EASY-TRACABILITY: backend/src/routes/stats.routes.ts

import { Router } from "express";
import { StatsController } from "../controllers/stats.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

// Auth obligatoire
router.use(hybridAuth);

router.get(
  "/overview",
  authorizeRole(["Administrateur", "Gestionnaire"]),
  catchAsync(StatsController.getOverview)
);

export default router;
