//EASY-TRACABILITY: backend/src/controllers/product.controller.ts

// backend/src/controllers/product.controller.ts
import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  static createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await ProductService.createProduct(req.body);
      res
        .status(201)
        .json({ message: "Produit créé avec succès", data: product });
    } catch (error) {
      next(error);
    }
  };

  static getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  static getProductByUUID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { uuid } = req.params;
      const product = await ProductService.getProductByUUID(uuid);
      if (!product) {
        res.status(404).json({ message: "Produit non trouvé" });
        return;
      }
      res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  };

  static getProductByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name } = req.params;
      const products = await ProductService.getProductByName(name);
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  static getProductByBarcode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { barcode } = req.params;
      const product = await ProductService.getProductByBarcode(barcode);
      if (!product) {
        res.status(404).json({ message: "Produit non trouvé" });
        return;
      }
      res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  };

  static getProductsInStock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await ProductService.getProductsInStock();
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  static getProductsLowStock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { threshold } = req.params;
      const products = await ProductService.getProductsLowStock(
        Number(threshold)
      );
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  static getProductsOutOfStock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await ProductService.getProductsOutOfStock();
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  static getProductsAbovePrice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { price } = req.params;
      const products = await ProductService.getProductsAbovePrice(
        Number(price)
      );
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  static updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { uuid } = req.params;
      const product = await ProductService.updateProduct(uuid, req.body);
      res
        .status(200)
        .json({ message: "Produit mis à jour avec succès", data: product });
    } catch (error) {
      next(error);
    }
  };

  static deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { uuid } = req.params;
      await ProductService.deleteProduct(uuid);
      res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (error) {
      next(error);
    }
  };
}
