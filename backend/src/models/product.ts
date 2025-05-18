// EASY-TRACABILITY: backend/src/models/product.ts

import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../config/database";
import { IProduct, IProductCreation } from "../interfaces/product.interface";
import { generateUniqueBarcode } from "../utils/barcodeGenerator";

export class ProductInstance
  extends Model<IProduct, IProductCreation>
  implements IProduct
{
  declare uuid: string;
  declare name: string;
  declare barcode: string;
  declare description: string;
  declare price: number;
  declare stockQuantity: number;
  declare imageUrl?: string;
}

export const ProductModel = ProductInstance.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255] },
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [12, 13],
        async isUnique(value: string) {
          const exists = await ProductModel.findOne({
            where: { barcode: value },
          });
          if (exists) throw new Error("Code‑barres déjà utilisé");
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len: [0, 500] },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { isFloat: true, min: 0 },
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isInt: true, min: 0 },
    },
    imageUrl: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      field: process.env.SEQ_UNDERSCORED === "true" ? "image_url" : "imageUrl",
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
    hooks: {
      beforeValidate: async (product) => {
        if (!product.barcode) {
          product.barcode = await generateUniqueBarcode();
        }
      },
    },
    scopes: {
      byUUID(uuid: string) {
        return { where: { uuid } };
      },
      byName(name: string) {
        return { where: { name: { [Op.like]: `%${name}%` } } };
      },
      byBarcode(barcode: string) {
        return { where: { barcode: { [Op.like]: `%${barcode}%` } } };
      },
      inStock: {
        where: { stockQuantity: { [Op.gt]: 0 } },
      },
      lowStock(threshold: number) {
        return { where: { stockQuantity: { [Op.lte]: threshold } } };
      },
      outOfStock: {
        where: { stockQuantity: 0 },
      },
      abovePrice(price: number) {
        return { where: { price: { [Op.gt]: price } } };
      },
    },
  }
);
