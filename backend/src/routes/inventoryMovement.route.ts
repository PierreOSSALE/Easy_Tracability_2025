//EASY-TRACABILITY: backend/src/routes/inventoryMovement.route.ts

import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

// Toutes les routes sont désormais sécurisées : hybridAuth obligatoire
router.use(hybridAuth);
