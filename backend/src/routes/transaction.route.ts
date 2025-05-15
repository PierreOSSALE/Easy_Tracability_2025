//EASY-TRACABILITY: backend/src/routes/transaction.route.ts

import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

// Auth obligatoire
router.use(hybridAuth);

// Routes sécurisées
router.get(
  "/",
  authorizeRole(["Admin", "Manager", "Operator"]),
  catchAsync(TransactionController.getAllTransactions)
);

router.post(
  "/",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(TransactionController.createTransaction)
);
router.get(
  "/export/csv",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(TransactionController.exportTransactionsCSV)
);
router.get(
  "/:uuid",
  authorizeRole(["Admin", "Manager", "Operator"]),

  catchAsync(TransactionController.getTransactionById)
);
router.put(
  "/:uuid",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(TransactionController.updateTransaction)
);
router.delete(
  "/:uuid",
  authorizeRole(["Admin"]),
  catchAsync(TransactionController.deleteTransaction)
);

router.get(
  "/:uuid/invoice",
  authorizeRole(["Admin", "Manager"]),
  catchAsync(TransactionController.generateInvoice)
);
export default router;
