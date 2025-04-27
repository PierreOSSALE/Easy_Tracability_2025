//EASY-TRACABILITY: backend/src/routes/product.route.ts

import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

// Middleware d'authentification obligatoire pour tout
router.use(hybridAuth);

// 🔒 Admin uniquement pour créer un produit
router.post(
  "/",
  authorizeRole(["Admin"]),
  catchAsync(ProductController.createProduct)
);

// 🔒 Admin, Gestionnaire, Opérateur : peuvent voir tous les produits
router.get(
  "/",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getAllProducts)
);

// 🔒 Lecture produit par UUID
router.get(
  "/:uuid",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getProductByUUID)
);

// 🔒 Recherche par nom
router.get(
  "/search/name/:name",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getProductByName)
);

// 🔒 Recherche par code-barres (important pour scan)
router.get(
  "/search/barcode/:barcode",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getProductByBarcode)
);

// 🔒 Liste produits en stock
router.get(
  "/in-stock",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getProductsInStock)
);

// 🔒 Liste produits faible stock
router.get(
  "/low-stock/:threshold",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getProductsLowStock)
);

// 🔒 Liste produits rupture de stock
router.get(
  "/out-of-stock",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getProductsOutOfStock)
);

// 🔒 Liste produits au-dessus d'un prix
router.get(
  "/above-price/:price",
  authorizeRole(["Admin", "Gestionnaire", "Opérateur"]),
  catchAsync(ProductController.getProductsAbovePrice)
);

// 🔒 Admin uniquement pour modifier un produit
router.patch(
  "/:uuid",
  authorizeRole(["Admin"]),
  catchAsync(ProductController.updateProduct)
);

// 🔒 Admin uniquement pour supprimer un produit
router.delete(
  "/:uuid",
  authorizeRole(["Admin"]),
  catchAsync(ProductController.deleteProduct)
);

export default router;
