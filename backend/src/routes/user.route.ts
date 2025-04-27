//EASY-TRACABILITY: backend/src/routes/user.route.ts

import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

router.use(hybridAuth);

router.get(
  "/search",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.getUsersByUsername)
);

router.get(
  "/role",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.getUsersByRole)
);

router.get(
  "/",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.getAllUsers)
);

// ✅ Correction : :uuid
router.get("/:uuid", catchAsync(UserController.getUserById));

router.post(
  "/",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.createUser)
);

// ✅ Correction : :uuid
router.put(
  "/:uuid",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.updateUser)
);

// ✅ Correction : :uuid
router.delete(
  "/:uuid",
  authorizeRole(["Administrateur"]),
  catchAsync(UserController.deleteUser)
);

export default router;
