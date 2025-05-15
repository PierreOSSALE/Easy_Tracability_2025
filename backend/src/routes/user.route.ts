//EASY-TRACABILITY: backend/src/routes/user.route.ts

import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();
router.get("/", catchAsync(UserController.getAllUsers));
router.use(hybridAuth);

router.get(
  "/search",
  authorizeRole(["Admin"]),
  catchAsync(UserController.getUsersByUsername)
);

router.get(
  "/role",
  authorizeRole(["Admin"]),
  catchAsync(UserController.getUsersByRole)
);

// ✅ Correction : :uuid
router.get("/:uuid", catchAsync(UserController.getUserById));

router.post(
  "/",
  authorizeRole(["Admin"]),
  catchAsync(UserController.createUser)
);

// ✅ Correction : :uuid
router.put(
  "/:uuid",
  authorizeRole(["Admin"]),
  catchAsync(UserController.updateUser)
);

// ✅ Correction : :uuid
router.delete(
  "/:uuid",
  authorizeRole(["Admin"]),
  catchAsync(UserController.deleteUser)
);

export default router;
