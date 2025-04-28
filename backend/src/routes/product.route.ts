//EASY-TRACABILITY: backend/src/routes/product.route.ts

import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

router.use(hybridAuth);

// 🔥 Lecture produits spécifiques doit venir avant ":uuid" pour éviter les 404

// 🔒 Liste produits en stock
router.get(
  "/in-stock",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(ProductController.getProductsInStock)
);

// 🔒 Liste produits rupture de stock
router.get(
  "/out-of-stock",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(ProductController.getProductsOutOfStock)
);

// 🔥 Liste produits avec stock inférieur à un seuil donné
router.get(
  "/low-stock",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(ProductController.getProductsLowStock)
);

// 🔒 Liste produits au-dessus d'un prix
router.get(
  "/above-price",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(ProductController.getProductsAbovePrice)
);

// 🔒 Recherche produit par name en query : /products/search?name=ProduitTest
router.get(
  "/search",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(ProductController.searchProducts)
);

router.post(
  "/",
  authorizeRole(["Administrateur"]),
  catchAsync(ProductController.createProduct)
);

router.get(
  "/",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(ProductController.getAllProducts)
);

// 🔥 Lecture produit par UUID
router.get(
  "/:uuid",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  catchAsync(ProductController.getProductByUUID)
);

// 🔥 Modifier un produit
router.put(
  "/:uuid",
  authorizeRole(["Administrateur"]),
  catchAsync(ProductController.updateProduct)
);

// 🔥 Supprimer un produit
router.delete(
  "/:uuid",
  authorizeRole(["Administrateur"]),
  catchAsync(ProductController.deleteProduct)
);

export default router;
