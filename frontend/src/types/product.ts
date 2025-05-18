// EASY-TRACABILITY:frontend/src/types/product.ts

export interface Product {
  uuid: string;
  name: string;
  barcode: string; // reste obligatoire quand on reçoit un produit
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

// pour la création, on n’inclut plus `barcode`
export type NewProductPayload = Omit<Product, "uuid" | "barcode">;
