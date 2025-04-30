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
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(TransactionController.getAllTransactions)
);

router.post(
  "/",
  authorizeRole(["Administrateur", "Gestionnaire"]),
  catchAsync(TransactionController.createTransaction)
);
router.get(
  "/export/csv",
  authorizeRole(["Administrateur", "Gestionnaire"]),
  catchAsync(TransactionController.exportTransactionsCSV)
);
router.get(
  "/:uuid",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),

  catchAsync(TransactionController.getTransactionById)
);
router.put(
  "/:uuid",
  authorizeRole(["Administrateur", "Gestionnaire"]),
  catchAsync(TransactionController.updateTransaction)
);
router.delete(
  "/:uuid",
  authorizeRole(["Administrateur"]),
  catchAsync(TransactionController.deleteTransaction)
);

router.get(
  "/:uuid/invoice",
  authorizeRole(["Administrateur", "Gestionnaire"]),
  catchAsync(TransactionController.generateInvoice)
);
export default router;
