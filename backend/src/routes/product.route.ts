//EASY-TRACABILITY: backend/src/routes/product.route.ts

import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const router = Router();

router.use(hybridAuth);

// 🔥 Lecture produits spécifiques doit venir avant ":uuid" pour éviter les 404

// 🔒 Liste produits en stock
router.get(
  "/in-stock",
  authorizeRole(["Admin", "Manager", "Operator"]),
  ProductController.getProductsInStock
);

// 🔒 Liste produits rupture de stock
router.get(
  "/out-of-stock",
  authorizeRole(["Admin", "Manager", "Operator"]),
  ProductController.getProductsOutOfStock
);

// 🔥 Liste produits avec stock inférieur à un seuil donné
router.get(
  "/low-stock",
  authorizeRole(["Admin", "Manager", "Operator"]),
  ProductController.getProductsLowStock
);

// 🔒 Liste produits au-dessus d'un prix
router.get(
  "/above-price",
  authorizeRole(["Admin", "Manager", "Operator"]),
  ProductController.getProductsAbovePrice
);

// 🔒 Recherche produit par name en query : /products/search?name=ProduitTest
router.get(
  "/search",
  authorizeRole(["Admin", "Manager", "Operator"]),
  ProductController.searchProducts
);

router.post(
  "/",
  authorizeRole(["Admin", "Manager"]),
  ProductController.createProduct
);

router.get(
  "/",
  authorizeRole(["Admin", "Manager", "Operator"]),
  ProductController.getAllProducts
);

// 🔥 Lecture produit par UUID
router.get(
  "/:uuid",
  authorizeRole(["Admin", "Manager", "Operator"]),
  ProductController.getProductByUUID
);

// 🔥 Modifier un produit
router.put("/:uuid", authorizeRole(["Admin"]), ProductController.updateProduct);

// 🔥 Supprimer un produit
router.delete(
  "/:uuid",
  authorizeRole(["Admin"]),
  ProductController.deleteProduct
);

export default router;
