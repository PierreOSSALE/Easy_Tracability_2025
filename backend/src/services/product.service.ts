//EASY-TRACABILITY: backend/src/services/product.service.ts

import {
  IProductCreation,
  IProductUpdate,
} from "../interfaces/product.interface";
import { ProductModel } from "../models/associations";

export class ProductService {
  static async createProduct(data: IProductCreation) {
    // Le hook beforeCreate sur le modèle gère la génération du barcode
    const product = await ProductModel.create(data);
    return product;
  }

  static async getAllProducts() {
    return await ProductModel.findAll();
  }

  static async getProductByUUID(uuid: string) {
    return await ProductModel.scope({ method: ["byUUID", uuid] }).findOne();
  }

  static async getProductByName(name: string) {
    return await ProductModel.scope({ method: ["byName", name] }).findAll();
  }

  static async getProductByBarcode(barcode: string) {
    return await ProductModel.scope({
      method: ["byBarcode", barcode],
    }).findOne();
  }

  static async getProductsInStock() {
    return await ProductModel.scope("inStock").findAll();
  }

  static async getProductsLowStock(threshold: number) {
    return await ProductModel.scope({
      method: ["lowStock", threshold],
    }).findAll();
  }

  static async getProductsOutOfStock() {
    return await ProductModel.scope("outOfStock").findAll();
  }

  static async getProductsAbovePrice(price: number) {
    return await ProductModel.scope({
      method: ["abovePrice", price],
    }).findAll();
  }

  static async updateProduct(uuid: string, data: IProductUpdate) {
    const product = await ProductModel.scope({
      method: ["byUUID", uuid],
    }).findOne();
    if (!product) throw new Error("Produit non trouvé");
    await product.update(data);
    return product;
  }

  static async deleteProduct(uuid: string) {
    const product = await ProductModel.scope({
      method: ["byUUID", uuid],
    }).findOne();
    if (!product) throw new Error("Produit non trouvé");
    await product.destroy();
  }
}
