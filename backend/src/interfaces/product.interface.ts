// EASY-TRACABILITY: backend/src/interface/user.interface.ts

export interface IProduct {
  uuid: string;
  name: string;
  barcode: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string; // optional image URL
}

export interface IProductCreation {
  uuid?: string;
  name: string;
  barcode?: string; // rendu optionnel, sera généré automatiquement
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface IProductUpdate {
  name?: string;
  barcode?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  imageUrl?: string;
}
