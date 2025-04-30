//EASY-TRACABILITY: backend/src/controllers/product.controller.ts

import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  static async createProduct(req: Request, res: Response): Promise<void> {
    const product = await ProductService.createProduct(req.body);
    res
      .status(201)
      .json({ message: "Produit créé avec succès", data: product });
  }

  static async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await ProductService.getAllProducts();
    res.status(200).json({ data: products });
  }

  static async getProductByUUID(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params; // ✅ Utilisation de uuid
    const product = await ProductService.getProductByUUID(uuid);
    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.status(200).json({ data: product });
  }
  // Ajout dans ProductController

  static async searchProducts(req: Request, res: Response): Promise<void> {
    const { name, barcode } = req.query;

    if (name) {
      const products = await ProductService.getProductByName(name.toString());
      res.status(200).json({ data: products });
      return;
    }

    if (barcode) {
      const product = await ProductService.getProductByBarcode(
        barcode.toString()
      );
      if (!product) {
        res.status(404).json({ message: "Produit non trouvé" });
        return;
      }
      res.status(200).json({ data: product });
      return;
    }

    res
      .status(400)
      .json({ message: "Paramètre de recherche manquant (name ou barcode)" });
  }

  static async getProductByName(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const products = await ProductService.getProductByName(name);
    res.status(200).json({ data: products });
  }

  static async getProductByBarcode(req: Request, res: Response): Promise<void> {
    const { barcode } = req.params;
    const product = await ProductService.getProductByBarcode(barcode);
    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.status(200).json({ data: product });
  }

  static async getProductsInStock(req: Request, res: Response): Promise<void> {
    const products = await ProductService.getProductsInStock();
    res.status(200).json({ data: products });
  }

  static async getProductsOutOfStock(
    req: Request,
    res: Response
  ): Promise<void> {
    const products = await ProductService.getProductsOutOfStock();
    res.status(200).json({ data: products });
  }

  static async getProductsLowStock(req: Request, res: Response): Promise<void> {
    // console.log("DEBUG - getProductsLowStock appelé");
    // console.log("DEBUG - req.query:", req.query);

    const queryThreshold = req.query.threshold;
    if (!queryThreshold) {
      res.status(400).json({
        message: "Le paramètre 'threshold' est requis dans la query.",
      });
      return;
    }

    const threshold = parseInt(queryThreshold as string, 10);
    // console.log("DEBUG - Seuil parsé:", threshold);

    if (isNaN(threshold) || threshold < 0) {
      res.status(400).json({ message: "Paramètre threshold invalide." });
      return;
    }

    const products = await ProductService.getProductsLowStock(threshold);
    // console.log(
    //   "DEBUG - Produits récupérés pour un seuil de",
    //   threshold,
    //   ":",
    //   products
    // );

    if (!products || products.length === 0) {
      res.status(404).json({
        message: "Aucun produit avec un stock inférieur au seuil spécifié.",
      });
      return;
    }
    res.status(200).json({ data: products });
  }
  static async updateProduct(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params; // ✅ Utilisation de uuid
    const product = await ProductService.updateProduct(uuid, req.body);
    res
      .status(200)
      .json({ message: "Produit mis à jour avec succès", data: product });
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params; // ✅ Utilisation de uuid
    await ProductService.deleteProduct(uuid);
    res.status(200).json({ message: "Produit supprimé avec succès" });
  }

  static async getProductsAbovePrice(
    req: Request,
    res: Response
  ): Promise<void> {
    const price = Number(req.query.price);
    const products = await ProductService.getProductsAbovePrice(price);
    res.status(200).json({ data: products });
  }
}
