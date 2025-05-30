// EASY-TRACABILITY: backend/src/routes/etl.route.ts
import { Router } from "express";
import { ETLController } from "../controllers/etl.controller";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { catchAsync } from "../utils/catchAsync.utils";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const etlRouter = Router();
etlRouter.use(hybridAuth);
etlRouter.post(
  "/run",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(ETLController.triggerETL)
);
etlRouter.get(
  "/logs",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(ETLController.getLogs)
);
export { etlRouter };
