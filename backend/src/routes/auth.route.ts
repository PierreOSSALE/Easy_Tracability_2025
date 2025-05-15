// EASY-TRACABILITY: backend/src/routes/auth.route.ts

import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", hybridAuth, AuthController.logout);
router.post("/request-reset-password", AuthController.requestResetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/me", hybridAuth, AuthController.getMe);

export default router;
