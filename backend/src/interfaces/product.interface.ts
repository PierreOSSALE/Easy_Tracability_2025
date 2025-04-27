// EASY-TRACABILITY: backend/src/interface/user.interface.ts

export interface IProduct {
  uuid: string;
  name: string;
  barcode: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string; // 🆕 Image facultative
}

export interface IProductCreation {
  uuid?: string;
  name: string;
  barcode: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string; // 🆕
}

export interface IProductUpdate {
  name?: string;
  barcode?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  imageUrl?: string; // 🆕
}
