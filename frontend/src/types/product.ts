// EASY-TRACABILITY:frontend/src/types/product.ts

export interface Product {
  uuid: string;
  name: string;
  barcode: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}
