//EASY-TRACABILITY: backend/src/controllers/product.controller.ts

import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { catchAsync } from "../utils/catchAsync.utils";

export class ProductController {
  static createProduct = catchAsync(async (req: Request, res: Response) => {
    const { barcode, ...rest } = req.body; // on ignore le barcode fourni
    const product = await ProductService.createProduct(rest);
    res
      .status(201)
      .json({ message: "Produit créé avec succès", data: product });
  });

  static getAllProducts = catchAsync(async (_req: Request, res: Response) => {
    const products = await ProductService.getAllProducts();
    res.status(200).json({ data: products });
  });

  static getProductByUUID = catchAsync(async (req: Request, res: Response) => {
    const { uuid } = req.params;
    const product = await ProductService.getProductByUUID(uuid);
    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.status(200).json({ data: product });
  });

  static searchProducts = catchAsync(async (req: Request, res: Response) => {
    const { name, barcode } = req.query;
    if (name) {
      const products = await ProductService.getProductByName(name.toString());
      return res.status(200).json({ data: products });
    }
    if (barcode) {
      const product = await ProductService.getProductByBarcode(
        barcode.toString()
      );
      if (!product)
        return res.status(404).json({ message: "Produit non trouvé" });
      return res.status(200).json({ data: product });
    }
    res.status(400).json({ message: "Paramètre manquant (name ou barcode)" });
  });

  static updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { uuid } = req.params;
    const product = await ProductService.updateProduct(uuid, req.body);
    res
      .status(200)
      .json({ message: "Produit mis à jour avec succès", data: product });
  });

  static deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { uuid } = req.params;
    await ProductService.deleteProduct(uuid);
    res.status(200).json({ message: "Produit supprimé avec succès" });
  });

  static getProductsInStock = catchAsync(
    async (_req: Request, res: Response) => {
      const products = await ProductService.getProductsInStock();
      res.status(200).json({ data: products });
    }
  );

  static getProductsLowStock = catchAsync(
    async (req: Request, res: Response) => {
      const thresholdParam = req.query.threshold;
      if (!thresholdParam) {
        return res
          .status(400)
          .json({ message: "Paramètre 'threshold' requis" });
      }
      const threshold = parseInt(thresholdParam as string, 10);
      if (isNaN(threshold) || threshold < 0) {
        return res
          .status(400)
          .json({ message: "Paramètre 'threshold' invalide" });
      }
      const products = await ProductService.getProductsLowStock(threshold);
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "Aucun produit sous le seuil spécifié" });
      }
      res.status(200).json({ data: products });
    }
  );

  static getProductsOutOfStock = catchAsync(
    async (_req: Request, res: Response) => {
      const products = await ProductService.getProductsOutOfStock();
      res.status(200).json({ data: products });
    }
  );

  static getProductsAbovePrice = catchAsync(
    async (req: Request, res: Response) => {
      const price = Number(req.query.price);
      const products = await ProductService.getProductsAbovePrice(price);
      res.status(200).json({ data: products });
    }
  );
}
