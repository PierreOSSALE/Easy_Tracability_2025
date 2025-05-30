// EASY-TRACABILITY: backend/src/routes/dashboard.route.ts
import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";
import { catchAsync } from "../utils/catchAsync.utils";

const dashboardRouter = Router();
dashboardRouter.use(hybridAuth);

dashboardRouter.get(
  "/trend",
  authorizeRole(["Admin", "Manager", "Operator"]),
  catchAsync(DashboardController.getInventoryTrend)
);
dashboardRouter.get(
  "/sales",
  authorizeRole(["Admin", "Manager", "Operator"]),
  catchAsync(DashboardController.getSalesByProduct)
);
dashboardRouter.get(
  "/alerts",
  authorizeRole(["Admin", "Manager", "Operator"]),
  catchAsync(DashboardController.getAlerts)
);
export { dashboardRouter };
