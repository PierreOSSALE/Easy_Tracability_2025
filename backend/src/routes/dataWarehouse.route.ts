// EASY-TRACABILITY: backend/src/routes/dataWarehouse.route.ts
import { Router } from "express";
import { DataWarehouseController } from "../controllers/dataWarehouse.controller";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { catchAsync } from "../utils/catchAsync.utils";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const dwRouter = Router();
dwRouter.use(hybridAuth);
dwRouter.get(
  "/facts",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(DataWarehouseController.queryFacts)
);
dwRouter.get(
  "/dimension/:dim/:key",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(DataWarehouseController.queryDimension)
);
export { dwRouter };
